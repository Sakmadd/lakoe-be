import midtransClient from 'midtrans-client';
import { CONFIGS } from '../config/config';

export const midtrans = new midtransClient.Snap({
  isProduction: false,
  serverKey: CONFIGS.MIDTRANS_SERVER_KEY,
  clientKey: CONFIGS.MIDTRANS_CLIENT_KEY,
});
