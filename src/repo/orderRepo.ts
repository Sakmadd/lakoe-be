import axios from 'axios';
import {
  CreateOrdersDTO,
  ResPaymentOrderDTO,
} from '../dtos/orders/createOrders';
import { prisma } from '../libs/prisma';
class orderRepository {
  async createOrder(data: CreateOrdersDTO) {
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

    console.log(responseMidtrans);

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
}
export default new orderRepository();
