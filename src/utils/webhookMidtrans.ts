import { OrderStatus } from '@prisma/client';
import { prisma } from '../libs/prisma';

export async function updatePaymentStatus(orderId: string, status: string) {
  const existingPayment = await prisma.payment.findUnique({
    where: { order_id: orderId },
  });

  if (!existingPayment) {
    throw new Error(`Payment record with order_id "${orderId}" not found.`);
  }

  const update = await prisma.payment.update({
    where: { order_id: orderId },
    data: {
      status: status,
    },
    select: {
      status: true,
    },
  });

  const findInvoiceID = await prisma.order.findUnique({
    where: {
      id: orderId,
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

  if (!findInvoiceID) {
    throw new Error(`Invoice with order_id "${orderId}" not found.`);
  }

  if (update.status === 'pending') {
    await prisma.orderHistory.create({
      data: {
        invoice_id: findInvoiceID.Recipient.Invoices.id,
        status: OrderStatus.unpaid,
      },
    });
  }

  if (update.status === 'paid') {
    await prisma.orderHistory.create({
      data: {
        invoice_id: findInvoiceID.Recipient.Invoices.id,
        status: OrderStatus.new_order,
      },
    });
  }

  return update.status;
}
