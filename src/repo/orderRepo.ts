import axios from 'axios';
import {
  CreateOrdersDTO,
  ResPaymentOrderDTO,
} from '../dtos/orders/createOrders';
import { prisma } from '../libs/prisma';
import { RatesRequestDTO, RatesResponseDTO } from '../dtos/orders/ratesOrder';
import { CONFIGS } from '../config/config';

export async function createOrder(data: CreateOrdersDTO) {
  const recipient = await prisma.recipient.create({
    data: {
      name: data.Recipient?.name || '',
      email: data.Recipient?.email || '',
      address: data.Recipient?.address || '',
      phone: data.Recipient?.phone || '',
      district: data.Recipient?.district || '',
      city: data.Recipient?.city || '',
      longitude: data.Recipient?.longitude || '',
      latitude: data.Recipient?.latitude || '',
    },
  });

  // const requestPayment = {
  //   payment_type: data.Payment.type,
  //   bank_transfer: {
  //     bank: data.Payment.bank,
  //   },
  //   transaction_details: {
  //     order_id: data.Payment.mt_order_id,
  //     gross_amount: data.Payment.amount,
  //   },
  //   account_name: data.Payment.account_name,
  //   account_number: data.Payment.account_number,
  //   url: data.Payment.url,
  //   status: data.Payment.status,
  // };

  const responseCharge = await axios.post(
    'https://api.sandbox.midtrans.com/v2/charge',
    // requestPayment,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(process.env.SERVER_KEY).toString('base64')}`,
      },
    },
  );
  const responseSnap = await axios.post(
    'https://app.sandbox.midtrans.com/snap/v1/transactions',
    {
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.SERVER_KEY).toString('base64')}`,
      },
    },
  );

  const responseMidtrans: ResPaymentOrderDTO = {
    mt_order_id: responseCharge.data.order_id, // Optional, depends on the payment type
    type: responseCharge.data.payment_type,
    url: responseSnap.data.redirect_url || '',
    bank: responseCharge.data.bank_transfer?.bank,
    amount: parseFloat(responseCharge.data.gross_amount),
    account_name: recipient.name,
    account_number: responseCharge.data.va_numbers[0].va_number,
    status: responseCharge.data.transaction_status,
    invoice_id: '',
  };

  const OrderItem = data.OrderItem;
  const order = await prisma.order.create({
    data: {
      recipient_id: recipient.id,
      total_price: data.total_price,
      OrderItem: {
        create: {
          quantity: OrderItem.quantity,
          Product: {
            create: {
              shop_id: OrderItem.Product?.shop_id || '',
              category_id: OrderItem.Product?.category_id || '',
              name: OrderItem.Product?.name || '',
              sku: OrderItem.Product?.sku || '',
              price: OrderItem.Product?.price || 0,
              url_name: OrderItem.Product?.url_name || '',
              description: OrderItem.Product?.description || '',
              stock: OrderItem.Product?.stock || 0,
              weight: OrderItem.Product?.weight || 0,
              minimum_order: OrderItem.Product?.minimum_order || 1,
              is_active: OrderItem.Product?.is_active || true,
              length: OrderItem.Product?.length || 0,
              width: OrderItem.Product?.width || 0,
              height: OrderItem.Product?.height || 0,
            },
          },
        },
      },
      Payment: {
        create: {
          invoice_id: responseMidtrans.invoice_id,
          mt_order_id: responseMidtrans.mt_order_id,
          type: responseMidtrans.type,
          url: responseMidtrans.url,
          bank: responseMidtrans.bank,
          amount: responseMidtrans.amount,
          account_name: responseMidtrans.account_name,
          account_number: responseMidtrans.account_number,
          status: responseMidtrans.status,
        },
      },
    },
    include: {
      OrderItem: {
        include: {
          Product: true,
        },
      },
    },
  });

  return order;
}

export async function shipmentLocation(city: string, postal_code: string) {
  try {
    const token = CONFIGS.BITESHIP_API_KEY;

    const formatInputLocation = city.replace(/ /g, '+');

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
        'https://static.wixstatic.com/media/ea5b1d_aab4e6818d9f432e9c7e31a21f133ef0~mv2.png/v1/fill/w_600,h_300,al_c/portfolio_paxel.png',
      jne: 'https://w7.pngwing.com/pngs/853/492/png-transparent-jalur-nugraha-ekakurir-logo-mail-business-jne-logistic-semarang-business-cdr-text-people-thumbnail.png',
      sicepat:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAdNW-mh6qNAWRzXjFTL2jwqBZy2a0q8W3Lw&s',
      jnt: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfD1sqgqqcl5iuI2m4zXMLXxBgP9CIOi1RID-mFoww1XacwfU-qOD-WJyWgPscIyFB-14qS-z13gJPx_eZzYyptYnG7TUSznlU7gOR9_BmqyhpwPbnECFBpDg0ymGq-rwj99ZTkyyTfXo/s320/J%2526T+Express+Logo+-+Free+Vector+Download+PNG.webp',
    };

    const finalResponse: RatesResponseDTO[] = response.data.pricing.map(
      (item: any) => ({
        price: item.price,
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
