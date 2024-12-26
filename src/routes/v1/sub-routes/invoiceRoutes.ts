import { Router } from 'express';
import invoiceController from '../../../controllers/invoiceController';
import { authentication } from '../../../middlewares/authentication';

const router = Router();

router.get('/:id', invoiceController.getInvoiceDetail.bind(invoiceController));

router.patch(
  '/:id',
  authentication,
  invoiceController.rejectOrder.bind(invoiceController),
);

router.post(
  '/:id',
  authentication,
  invoiceController.createOrderBiteship.bind(invoiceController),
);

router.post('/wa/:id', invoiceController.postToWa.bind(invoiceController));

export default router;
