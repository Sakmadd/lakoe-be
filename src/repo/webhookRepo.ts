import { BiteshipStatusRequestDTO } from '../dtos/webhook/biteshipStatus';
import { MidtransDTO } from '../dtos/webhook/midtrans';
import { updateOrderStatus } from '../utils/webhookBiteship';
import { updatePaymentStatus } from '../utils/webhookMidtrans';

export async function postMidtrans(notificationJSON: MidtransDTO) {
  try {
    let status = '';

    if (notificationJSON.transaction_status === 'settlement') {
      status = await updatePaymentStatus(notificationJSON.order_id, 'paid');
    } else if (notificationJSON.transaction_status === 'success') {
      status = await updatePaymentStatus(notificationJSON.order_id, 'paid');
    } else if (notificationJSON.transaction_status === 'cancel') {
      status = await updatePaymentStatus(notificationJSON.order_id, 'canceled');
    } else if (notificationJSON.transaction_status === 'deny') {
      status = await updatePaymentStatus(notificationJSON.order_id, 'canceled');
    } else if (notificationJSON.transaction_status === 'expire') {
      status = await updatePaymentStatus(notificationJSON.order_id, 'canceled');
    } else if (notificationJSON.transaction_status === 'pending') {
      status = await updatePaymentStatus(notificationJSON.order_id, 'pending');
    } else if (notificationJSON.transaction_status === 'refund') {
      status = await updatePaymentStatus(notificationJSON.order_id, 'refunded');
    } else {
      throw new Error(
        `Unknown transaction status: "${notificationJSON.transaction_status}"`,
      );
    }

    return { status };
  } catch (error) {
    console.error('Error processing Midtrans webhook:', error);
    throw new Error('Failed to process the notification.');
  }
}

export async function biteshipStatus(data: BiteshipStatusRequestDTO) {
  try {
    let status = '';

    if (data.status === 'dropping_off') {
      status = await updateOrderStatus(data.order_id, 'dropping_off');
    } else if (data.status === 'delivered') {
      status = await updateOrderStatus(data.order_id, 'delivered');
    }

    console.log(status);

    return { status };
  } catch (error) {
    console.error('Error processing Biteship webhook:', error);
    throw new Error('Failed to process the notification.');
  }
}
