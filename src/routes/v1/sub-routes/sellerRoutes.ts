import { Router } from 'express';
import sellerController from '../../../controllers/sellerController';

const sellerDasboard = Router();
sellerDasboard.get('/', sellerController.getDashboard.bind(sellerController));
sellerDasboard.get('/graphs', sellerController.getGraph.bind(sellerController));
export default sellerDasboard;
