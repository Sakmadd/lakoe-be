import { Router } from 'express';
import withdrawController from '../../../controllers/withdrawController';

const withdrawRoutes = Router();

withdrawRoutes.get(
  '/get',
  withdrawController.getWithdraw.bind(withdrawController),
);
withdrawRoutes.post(
  '/',
  withdrawController.createWithdraw.bind(withdrawController),
);
withdrawRoutes.patch(
  '/update/:id',
  withdrawController.checkWithdraw.bind(withdrawController),
);
withdrawRoutes.get(
  '/seller',
  withdrawController.getWithdrawById.bind(withdrawController),
);
export default withdrawRoutes;
