import { Router } from 'express';
import dashboadController from '../../../controllers/sellerController';

const sellerDasboard = Router();
sellerDasboard.get(
  '/',
  dashboadController.getDashboard.bind(dashboadController),
);
export default sellerDasboard;
