import axios from 'axios';
import { prisma } from '../libs/prisma';
import { RatesRequestDTO, RatesResponseDTO } from '../dtos/orders/ratesOrder';
import { CONFIGS } from '../config/config';
import {
  CreateOrderRequestDTO,
  CreateOrderResponseDTO,
} from '../dtos/orders/createOrderV2';
import { GetOrderByIdDTO } from '../dtos/orders/getOrderByID';
import { generateInvoiceNumber, shipmentLocation } from '../utils/order';
import { OrderStatus } from '@prisma/client';

export async function createOrder(data: CreateOrderRequestDTO) {
  try {
    if (!data.items.product_id) {
      throw new Error('Product ID is missing.');
    }

    let variantPrice: number | null = null;

    if (data.items.variant_combination_id) {
      const variantOptionCombination =
        await prisma.variantOptionCombination.findUnique({
          where: { id: data.items.variant_combination_id },
          select: { price: true },
        });

      if (!variantOptionCombination) {
        throw new Error('Variant option combination not found.');
      }
      variantPrice = variantOptionCombination.price;
    }

    const findProduct = await prisma.product.findFirst({
      where: { id: data.items.product_id },
      select: { shop_id: true, price: true, name: true },
    });

    if (!findProduct) {
      throw new Error('Product not found.');
    }

    const productPrice = variantPrice ?? findProduct.price;
    const productTotalPrice = data.items.quantity * productPrice;
    const totalPrice = productTotalPrice + data.courier_price;

    const initializingRecipient = await prisma.recipient.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        district: data.district,
        city: data.city,
        postal_code: data.postal_code,
        longitude: data.longitude,
        latitude: data.latitude,
      },
    });

    const invoice = await prisma.invoices.create({
      data: {
        recipient_id: initializingRecipient.id,
        shop_id: findProduct.shop_id,
        price: productTotalPrice,
        service_charge: data.courier_price,
        invoice_number: '',
        OrderHistory: {
          create: {
            status: OrderStatus.unpaid,
          },
        },
      },
    });

    const currentDate = new Date();
    const startOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    );
    const endOfDay = new Date(startOfDay.getTime() + 86399999);

    const invoiceCountToday = await prisma.invoices.count({
      where: {
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
    const invoiceNumber = generateInvoiceNumber(invoiceCountToday);

    const updateInvoice = await prisma.invoices.update({
      where: { id: invoice.id },
      data: {
        invoice_number: invoiceNumber,
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
          price: productPrice,
          quantity: data.items.quantity,
          name: findProduct.name,
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
          Authorization: `Basic ${Buffer.from(`${CONFIGS.MIDTRANS_SERVER_KEY}:`).toString('base64')}`,
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

    const findData = await getOrderByID(order.id);

    const finalResponse: CreateOrderResponseDTO = {
      token: token,
      redirect_url: redirect_url,
      order: findData,
    };

    return finalResponse;
  } catch (error) {
    console.error('Error creating order:', error.message, error.stack);
    throw new Error('Failed to create order.');
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

    const regRates = response.data.pricing.filter(
      (item: any) => item.type && item.type.toLowerCase() === 'reg',
    );

    const finalResponse: RatesResponseDTO[] = regRates.map((item: any) => ({
      price: item.price,
      origin_area_id: originId,
      destination_area_id: destinationId,
      company: item.company,
      courier_name: item.courier_name,
      courier_code: item.courier_code,
      courier_type: item.type,
      courier_image: courierImages[item.courier_code] || '',
    }));

    return finalResponse;
  } catch (error) {
    throw new Error(
      `Error calculating shipment rates: ${error instanceof Error ? error.message : error}`,
    );
  }
}

export async function getOrderByID(id: string) {
  const order = await prisma.order.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      total_price: true,
      created_at: true,
      updated_at: true,
      OrderItem: {
        select: {
          id: true,
          product_id: true,
          quantity: true,
          Product: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              Images: true,
            },
          },
        },
      },
      Payment: {
        select: {
          id: true,
          url: true,
        },
      },
      Recipient: {
        include: {
          Invoices: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  const finalResponse: GetOrderByIdDTO = {
    id: order.id,
    total_price: order.total_price,
    created_at: order.created_at,
    updated_at: order.updated_at,
    OrderItem: {
      id: order.OrderItem.id,
      product_id: order.OrderItem.product_id,
      quantity: order.OrderItem.quantity,
      Product: {
        id: order.OrderItem.Product.id,
        name: order.OrderItem.Product.name,
        description: order.OrderItem.Product.description,
        price: order.OrderItem.Product.price,
        image: order.OrderItem.Product.Images[0].src || '',
      },
    },
    Payment: {
      id: order.Payment.id,
      url: order.Payment.url,
    },
    Recipient: order.Recipient,
  };

  return finalResponse;
}
