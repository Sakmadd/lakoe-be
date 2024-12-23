import { Router } from 'express';
import sellerController from '../../../controllers/sellerController';

const sellerDasboard = Router();
sellerDasboard.get('/', sellerController.getDashboard.bind(sellerController));
sellerDasboard.get('/graphs', sellerController.getGraph.bind(sellerController));

sellerDasboard.get(
  '/all-order',
  sellerController.getAllOrder.bind(sellerController),
);

export default sellerDasboard;
