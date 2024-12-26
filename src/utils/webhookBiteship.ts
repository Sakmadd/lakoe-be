import { prisma } from '../libs/prisma';
import { OrderStatus } from '@prisma/client';

export async function updateOrderStatus(orderId: string, status: string) {
  if (!orderId || !status) {
    throw new Error('Invalid order ID or status.');
  }

  const findInvoiceID = await prisma.courier.findFirst({
    where: {
      biteship_order_id: orderId,
    },
    select: {
      invoice_id: true,
    },
  });

  if (!findInvoiceID) {
    throw new Error(`Invoice record with order_id "${orderId}" not found.`);
  }

  if (status === 'dropping_off') {
    await prisma.orderHistory.create({
      data: {
        invoice_id: findInvoiceID.invoice_id,
        status: OrderStatus.on_delivery,
      },
    });
  }

  if (status === 'delivered') {
    await prisma.orderHistory.create({
      data: {
        invoice_id: findInvoiceID.invoice_id,
        status: OrderStatus.done,
      },
    });
  }

  return status;
}
