import { Router } from 'express';
import adminController from '../../../controllers/adminController';

const router = Router();

router.get('/balance', adminController.getAllBalance.bind(adminController));

// router.get(
//   '/transactions',
//   adminController.getAllTransaction.bind(adminController),
// );

router.get('/users', adminController.getAllUser.bind(adminController));

router.get('/categories', adminController.getAllCategory.bind(adminController));

router.get('/withdraws', adminController.getAllWithdraw.bind(adminController));

export default router;
