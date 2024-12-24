import { Router } from 'express';
import orderController from '../../../controllers/orderController';

const router = Router();
router.get('/', (req, res) => {
  res.send('Orders routes');
});

router.post('/', orderController.postOrder.bind(orderController));

router.get('/:id', orderController.getOrderById.bind(orderController));

router.post('/rates', orderController.shipmentRates.bind(orderController));

export default router;
