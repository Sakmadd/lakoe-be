import { Router } from 'express';
import webhookController from '../../../controllers/webhookController';

const router = Router();

router.post(
  '/midtrans',
  webhookController.postMidtrans.bind(webhookController),
);

export default router;
