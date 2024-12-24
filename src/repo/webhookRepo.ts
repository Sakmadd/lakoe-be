import { MidtransDTO } from '../dtos/webhook/midtrans';
import { midtrans } from '../libs/midtrans';
import { prisma } from '../libs/prisma';

async function updatePaymentStatus(orderId: string, status: string) {
  await prisma.payment.update({
    where: { order_id: orderId },
    data: { status },
  });
}

export async function postMidtrans(notificationJSON: MidtransDTO) {
  try {
    if (!notificationJSON || !notificationJSON.order_id) {
      throw new Error('Invalid notification JSON');
    }

    const statusResponse =
      await midtrans.transaction.notification(notificationJSON);
    const {
      order_id: orderId,
      transaction_status: transactionStatus,
      fraud_status: fraudStatus,
    } = statusResponse;

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        console.log(`Order ${orderId} is successful.`);
        await updatePaymentStatus(orderId, 'success');
      } else if (fraudStatus === 'challenge') {
        console.log(`Order ${orderId} requires manual review.`);
        await updatePaymentStatus(orderId, 'challenge');
      }
    } else if (transactionStatus === 'settlement') {
      console.log(`Order ${orderId} has been settled.`);
      await updatePaymentStatus(orderId, 'settlement');
    } else if (
      transactionStatus === 'cancel' ||
      transactionStatus === 'deny' ||
      transactionStatus === 'expire'
    ) {
      console.log(`Order ${orderId} has failed.`);
      await updatePaymentStatus(orderId, 'failure');
    } else if (transactionStatus === 'pending') {
      console.log(`Order ${orderId} is pending.`);
      await updatePaymentStatus(orderId, 'pending');
    } else {
      console.log(`Unhandled transaction status: ${transactionStatus}`);
    }

    return transactionStatus;
  } catch (error) {
    return error;
  }
}
