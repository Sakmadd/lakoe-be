import { Router } from 'express';
import webhookController from '../../../controllers/webhookController';

const router = Router();

router.post(
  '/midtrans',
  webhookController.postMidtrans.bind(webhookController),
);

router.post(
  '/biteship/status',
  webhookController.biteshipStatus.bind(webhookController),
);

export default router;
