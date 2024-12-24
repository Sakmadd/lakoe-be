import axios from 'axios';
import { prisma } from '../libs/prisma';
import { RatesRequestDTO, RatesResponseDTO } from '../dtos/orders/ratesOrder';
import { CONFIGS } from '../config/config';
import {
  CreateOrderRequestDTO,
  CreateOrderResponseDTO,
} from '../dtos/orders/createOrderV2';

export async function createOrder(data: CreateOrderRequestDTO) {
  try {
    if (!data.items.product_id) {
      throw new Error('Product ID is missing.');
    }

    const findShopId = await prisma.product.findFirst({
      where: { id: data.items.product_id },
      select: { shop_id: true },
    });

    if (!findShopId) {
      throw new Error('Shop not found for the given product.');
    }

    const findVariantOptionCombination =
      await prisma.variantOptionCombination.findFirst({
        where: { id: data.items.variant_combination_id },
        select: { name: true },
      });

    const findProductName = await prisma.product.findFirst({
      where: { id: data.items.product_id },
      select: { name: true },
    });

    const productTotalPrice = data.items.quantity * data.items.price;
    const totalPrice = productTotalPrice + data.courier_price;

    const initializingRecipient = await prisma.recipient.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        district: data.district,
        city: data.city,
        longitude: data.longitude,
        latitude: data.latitude,
      },
    });

    const invoice = await prisma.invoices.create({
      data: {
        recipient_id: initializingRecipient.id,
        shop_id: findShopId.shop_id,
        prices: productTotalPrice,
        service_charge: data.courier_price,
        invoice_number: generateInvoiceNumber(),
      },
    });

    const order = await prisma.order.create({
      data: {
        recipient_id: initializingRecipient.id,
        total_price: totalPrice,
      },
    });

    const orderItem = await prisma.orderItem.create({
      data: {
        order_id: order.id,
        product_id: data.items.product_id,
        variant_combination_id: data.items.variant_combination_id || '',
        quantity: data.items.quantity,
      },
    });

    const payment = await prisma.payment.create({
      data: {
        Invoice: { connect: { id: invoice.id } },
        type: null,
        url: '',
        bank: null,
        amount: totalPrice,
        account_name: null,
        account_number: null,
        status: 'pending',
        Order: { connect: { id: order.id } },
      },
    });

    const courier = await prisma.courier.create({
      data: {
        Invoices: { connect: { id: invoice.id } },
        order: { connect: { id: order.id } },
        origin_area_id: data.origin_area_id,
        destination_area_id: data.destination_area_id,
        price: data.courier_price,
        courier_company: data.courier_company,
        courier_code: data.courier_code,
        courier_type: data.courier_type,
      },
    });

    const midtransRequest = {
      transaction_details: {
        order_id: order.id,
        gross_amount: totalPrice,
      },
      customer_details: {
        first_name: data.name,
        email: data.email,
        phone: data.phone,
      },
      item_details: [
        {
          id: data.items.product_id,
          price: data.items.price,
          quantity: data.items.quantity,
          name: findProductName.name,
        },
        {
          id: 'courier_fee',
          price: data.courier_price,
          quantity: 1,
          name: `Courier: ${data.courier_company} (${data.courier_type})`,
        },
      ],
    };

    const midtransResponse = await axios.post(
      'https://app.sandbox.midtrans.com/snap/v1/transactions',
      midtransRequest,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.MIDTRANS_SERVER_KEY}:`,
          ).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (midtransResponse.status !== 201) {
      console.error('Midtrans API error:', midtransResponse.data);
      throw new Error('Failed to create Midtrans transaction.');
    }

    const { token, redirect_url } = midtransResponse.data;

    const updatedPayment = await prisma.payment.update({
      where: { invoice_id: invoice.id },
      data: { url: redirect_url },
    });

    const finalResponse: CreateOrderResponseDTO = {
      order_id: order.id,
      token: token,
      redirect_url: redirect_url,
    };

    return finalResponse;
  } catch (error) {
    console.error('Error creating order:', error.message, error.stack);
    throw new Error('Failed to create order.');
  }
}

function generateInvoiceNumber(): string {
  return `INV-${Date.now()}`;
}

function formatCityName(input: string) {
  return input.replace(/^(Kabupaten|Kota)\s+/i, '').toLowerCase();
}

async function shipmentLocation(city: string, postal_code: string) {
  try {
    const token = CONFIGS.BITESHIP_API_KEY;

    const formatInputLocation = formatCityName(city).replace(/ /g, '+');

    const hitLocation = await axios.get(
      `https://api.biteship.com/v1/maps/areas?countries=ID&input=${formatInputLocation}&type=single`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (hitLocation.data?.success && hitLocation.data?.areas?.length > 0) {
      const areas = hitLocation.data.areas;

      const matchingArea = areas.find(
        (area: any) => area.postal_code === postal_code,
      );

      return matchingArea ? matchingArea.id : areas[0].id;
    } else {
      throw new Error('Invalid API response or no areas found');
    }
  } catch (error) {
    throw new Error(
      `Error fetching shipment location: ${error instanceof Error ? error.message : error}`,
    );
  }
}

export async function shipmentRates(data: RatesRequestDTO) {
  try {
    const token = CONFIGS.BITESHIP_API_KEY;

    if (!token) {
      throw new Error('Token not found.');
    }

    const findShopIdByProduct = await prisma.product.findFirst({
      where: {
        id: data.items.id,
      },
      select: {
        shop_id: true,
      },
    });

    if (!findShopIdByProduct) {
      throw new Error('Shop not found for the provided product.');
    }

    const findShopById = await prisma.shop.findFirst({
      where: {
        id: findShopIdByProduct.shop_id,
      },
      select: {
        location: true,
      },
    });

    if (
      !findShopById ||
      !findShopById.location ||
      !Array.isArray(findShopById.location)
    ) {
      throw new Error('Shop location not found.');
    }

    const mainLocation = findShopById.location.find((loc: any) => loc.is_main);

    if (!mainLocation) {
      throw new Error('Main location not found.');
    }

    const shopCity = mainLocation.city;
    const shopPostalCode = mainLocation.postal_code;

    const originId = await shipmentLocation(shopCity, shopPostalCode);
    const destinationId = await shipmentLocation(data.city, data.postal_code);

    const requestPayload = {
      origin_area_id: originId,
      destination_area_id: destinationId,
      origin_postal_code: shopPostalCode,
      destination_postal_code: data.postal_code,
      origin_longitude: mainLocation.longitude,
      origin_latitude: mainLocation.latitude,
      destination_longitude: data.longitude,
      destination_latitude: data.latitude,
      couriers: 'paxel,jne,sicepat,jnt',
      items: [
        {
          name: data.items.name,
          value: data.items.price,
          length: data.items.length,
          width: data.items.width,
          height: data.items.height,
          weight: data.items.weight,
          quantity: data.quantity,
        },
      ],
    };

    const response = await axios.post(
      'https://api.biteship.com/v1/rates/couriers',
      requestPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const courierImages: Record<string, string> = {
      paxel:
        'https://static.wikia.nocookie.net/logopedia/images/2/25/Paxel.svg/revision/latest/scale-to-width-down/300?cb=20230909131511',
      jne: 'https://upload.wikimedia.org/wikipedia/commons/9/92/New_Logo_JNE.png',
      sicepat: 'https://pakar.co.id/storage/2019/08/si-cepat.png',
      jnt: 'https://i.pinimg.com/originals/27/33/d4/2733d452329a7a5a73e3922a36e69370.png',
    };

    const finalResponse: RatesResponseDTO[] = response.data.pricing.map(
      (item: any) => ({
        price: item.price,
        origin_area_id: originId,
        destination_area_id: destinationId,
        company: item.company,
        courier_name: item.courier_name,
        courier_code: item.courier_code,
        courier_type: item.type,
        courier_image: courierImages[item.courier_code] || '',
      }),
    );

    return finalResponse;
  } catch (error) {
    throw new Error(
      `Error calculating shipment rates: ${error instanceof Error ? error.message : error}`,
    );
  }
}
