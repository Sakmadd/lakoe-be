import Twilio from 'twilio';
import { CONFIGS } from '../config/config';

export const twilio = Twilio(
  CONFIGS.TWILIO_ACCOUNT_SID,
  CONFIGS.TWILIO_AUTH_TOKEN,
);
