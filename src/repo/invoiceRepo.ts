import axios from 'axios';
import { CONFIGS } from '../config/config';
import { prisma } from '../libs/prisma';
import { twilio } from '../libs/twillio';
import { OrderStatus } from '@prisma/client';
import { CreateOrderBiteshipResponseDTO } from '../dtos/invoice/createOrderBiteshipDTO';
import { InvoiceBuyerDTO, ProductDTO } from '../dtos/invoice/invoiceBuyerDTO';

export async function postToWa(id: string) {
  const invoiceId = await prisma.order.findUnique({
    where: {
      id: id,
    },
    select: {
      Recipient: {
        select: {
          Invoices: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  const findInvoice = await prisma.invoices.findUnique({
    where: {
      id: invoiceId.Recipient.Invoices.id,
    },
    include: {
      Recipient: true,
      Payment: true,
      Courier: true,
      Shop: true,
      OrderHistory: true,
    },
  });

  if (!findInvoice) {
    throw new Error('Invoice not found');
  }

  let receiverPhone = findInvoice.Recipient.phone;
  if (!receiverPhone.startsWith('+62')) {
    if (receiverPhone.startsWith('0')) {
      receiverPhone = '+62' + receiverPhone.slice(1);
    } else {
      receiverPhone = '+62' + receiverPhone;
    }
  }

  const paymentUrl = findInvoice.Payment.url;

  const recipientName = findInvoice.Recipient.name;

  const message = `Hello ${recipientName}!!,
    
Thanks for your order. Please click the link below to pay your order.

${paymentUrl}`;

  try {
    const sendMessage = await twilio.messages.create({
      from: CONFIGS.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${receiverPhone}`,
      body: message,
    });

    return {
      message: 'Message sent successfully',
    };
  } catch (error) {
    console.error('Error sending message via WhatsApp:', error);
  }
}

export async function createOrderBiteship(id: string) {
  const data = await prisma.invoices.findUnique({
    where: {
      id,
    },
    include: {
      Courier: true,
      OrderHistory: true,
      Payment: true,
      Recipient: true,
      Shop: {
        include: {
          User: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  if (!data) {
    throw new Error('Invoice not found');
  }

  const findLocationOrigin = await prisma.location.findFirst({
    where: {
      shop_id: data.Shop.id,
      is_main: true,
    },
    select: {
      address: true,
      postal_code: true,
    },
  });

  const findOrderItem = await prisma.recipient.findUnique({
    where: {
      id: data.Recipient.id,
    },
    select: {
      Order: {
        select: {
          OrderItem: true,
        },
      },
    },
  });

  if (
    !findOrderItem ||
    !findOrderItem.Order ||
    !findOrderItem.Order.OrderItem
  ) {
    throw new Error('Order item not found');
  }

  const orderItem = findOrderItem.Order.OrderItem;

  let productDetails;

  if (orderItem.variant_combination_id) {
    productDetails = await prisma.variantOptionCombination.findUnique({
      where: {
        id: orderItem.variant_combination_id,
      },
      select: {
        name: true,
        price: true,
        weight: true,
        Product: {
          select: {
            height: true,
            width: true,
            length: true,
          },
        },
      },
    });

    if (productDetails) {
      productDetails.height = productDetails.Product?.height || null;
      productDetails.width = productDetails.Product?.width || null;
      productDetails.length = productDetails.Product?.length || null;
    }
  } else {
    productDetails = await prisma.product.findUnique({
      where: {
        id: orderItem.product_id,
      },
      select: {
        name: true,
        description: true,
        price: true,
        width: true,
        height: true,
        length: true,
        weight: true,
      },
    });
  }

  if (!productDetails) {
    throw new Error('Product or variant combination not found');
  }

  const request = {
    origin_contact_name: data.Shop.name,
    origin_contact_phone: data.Shop.phone,
    origin_contact_email: data.Shop.User.email,
    origin_address: findLocationOrigin.address,
    origin_postal_code: findLocationOrigin.postal_code,
    origin_area_id: data.Courier.origin_area_id,
    destination_contact_name: data.Recipient.name,
    destination_contact_phone: data.Recipient.phone,
    destination_contact_email: data.Recipient.email,
    destination_address: data.Recipient.address,
    destination_postal_code: data.Recipient.postal_code,
    courier_company: data.Courier.courier_company,
    courier_type: data.Courier.courier_type,
    delivery_type: 'now',
    cost: data.Courier.price,
    items: [
      {
        id: orderItem.variant_combination_id || orderItem.product_id,
        name: productDetails.name,
        description: productDetails.description || 'No description available',
        value: productDetails.price,
        quantity: orderItem.quantity,
        height: productDetails.height,
        length: productDetails.length,
        weight: productDetails.weight,
        width: productDetails.width,
      },
    ],
  };

  try {
    const response = await axios.post(
      'https://api.biteship.com/v1/orders',
      request,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CONFIGS.BITESHIP_API_KEY}`,
        },
      },
    );

    const responseData = response.data;

    const updatingCourrier = await prisma.courier.update({
      where: {
        id: data.Courier.id,
      },
      data: {
        waybill_id: responseData.courier.waybill_id,
        tracking_id: responseData.courier.tracking_id,
        biteship_order_id: responseData.id,
      },
    });

    const createOrderHistory = await prisma.orderHistory.create({
      data: {
        invoice_id: data.id,
        status: OrderStatus.ready_to_ship,
      },
    });

    const finalResponse: CreateOrderBiteshipResponseDTO = {
      biteship_order_id: responseData.id,
      id: data.id,
      recipient_id: data.Recipient.id,
      shop_id: data.Shop.id,
      price: responseData.price || 0,
      service_charge: responseData.service_charge || 0,
      Courier: data.Courier
        ? {
            id: data.Courier.id,
            origin_area_id: data.Courier.origin_area_id,
            destination_area_id: data.Courier.destination_area_id,
            price: data.Courier.price,
            courier_company: data.Courier.courier_company,
            courier_code: data.Courier.courier_code,
            courier_type: data.Courier.courier_type,
            tracking_id: data.Courier.tracking_id,
            waybill_id: data.Courier.waybill_id,
          }
        : undefined,
      Payment: data.Payment
        ? {
            id: data.Payment.id,
            type: data.Payment.type,
            url: data.Payment.url,
            bank: data.Payment.bank,
            amount: data.Payment.amount,
            account_name: data.Payment.account_name,
            account_number: data.Payment.account_number,
            status: data.Payment.status,
            created_at: data.Payment.created_at,
            updated_at: data.Payment.updated_at,
          }
        : undefined,
      Recipient: {
        id: data.Recipient.id,
        name: data.Recipient.name,
        phone: data.Recipient.phone,
        address: data.Recipient.address,
      },
    };

    return finalResponse;
  } catch (error) {
    console.error(
      'Error creating order via Biteship:',
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || 'Error creating order via Biteship',
    );
  }
}

export async function getInvoiceDetail(id: string) {
  const invoice = await prisma.invoices.findUnique({
    where: { id },
    include: {
      Recipient: true,
      Shop: true,
      Payment: true,
      Courier: true,
      OrderHistory: true,
    },
  });

  if (!invoice) {
    throw new Error('Invoice not found');
  }

  const findingVariantOptionCombinationID = await prisma.order.findUnique({
    where: {
      recipient_id: invoice.recipient_id,
    },
    select: {
      OrderItem: {
        select: {
          variant_combination_id: true,
        },
      },
    },
  });

  let variantOptionCombinationData = null;
  if (findingVariantOptionCombinationID?.OrderItem?.variant_combination_id) {
    variantOptionCombinationData =
      await prisma.variantOptionCombination.findUnique({
        where: {
          id: findingVariantOptionCombinationID.OrderItem
            .variant_combination_id,
        },
        select: {
          name: true,
          price: true,
        },
      });
  }

  const orderItem = await prisma.order.findUnique({
    where: { recipient_id: invoice.recipient_id },
    select: {
      OrderItem: {
        select: {
          quantity: true,
          Product: {
            select: {
              name: true,
              price: true,
              Images: {
                select: {
                  src: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!orderItem || !orderItem.OrderItem) {
    throw new Error('Order item not found');
  }

  const item = orderItem.OrderItem;
  const variant = variantOptionCombinationData;

  const product: ProductDTO = {
    name: variant
      ? `${variant.name} + ${item.Product.name}`
      : item.Product.name,
    image: item.Product.Images?.[0]?.src || '',
    price: variant?.price || item.Product.price,
    quantity: item.quantity,
    total_price: (variant?.price || item.Product.price) * item.quantity,
  };

  const serviceFee = Math.floor(
    (product.total_price + invoice.service_charge / 100) * 0.05,
  );

  const finalResponse: InvoiceBuyerDTO = {
    id: invoice.id,
    price: invoice.price,
    invoice_number: invoice.invoice_number,
    created_at: invoice.created_at,
    Courier: {
      courier_company: invoice.Courier?.courier_company,
      courier_code: invoice.Courier?.courier_code,
      tracking_id: invoice.Courier?.tracking_id || '-',
      waybill_id: invoice.Courier?.waybill_id || '-',
    },
    Payment: {
      url: invoice.Payment?.url,
    },
    Recipient: {
      name: invoice.Recipient?.name,
      address: invoice.Recipient?.address,
    },
    Shop: {
      name: invoice.Shop?.name,
      logo: invoice.Shop?.logo,
      slogan: invoice.Shop?.slogan,
    },
    Product: product,
    Price: {
      total_price: product.total_price,
      shipping_cost: invoice.service_charge,
      discount: 0,
      service_fee: serviceFee,
      total: product.total_price + invoice.service_charge + 0 + serviceFee,
    },
    OrderHistory: invoice.OrderHistory.map((history) => ({
      status: history.status,
      timestamp: history.timestamp,
    })),
  };

  return finalResponse;
}

export async function rejectOrder(id: string) {
  const invoice = await prisma.invoices.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
    },
  });

  if (!invoice) {
    throw new Error(`Invoice with ${id} is not found !!`);
  }

  const update = await prisma.orderHistory.create({
    data: {
      invoice_id: invoice.id,
      status: OrderStatus.canceled,
    },
  });

  return update.status;
}
