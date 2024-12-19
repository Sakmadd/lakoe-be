import { Router } from 'express';
import orderController from '../../../controllers/orderController';

const router = Router();
router.get('/', (req, res) => {
  res.send('Orders routes');
});
router.post('/post', orderController.postOrder.bind(orderController));
// router.post('/payment', orderController.payment.bind(orderController))

router.post('/rates', orderController.shipmentRates.bind(orderController));
export default router;
