import { Router } from 'express';
import shopController from '../../../controllers/shopController';

const bankRouter = Router();

bankRouter.get('/get', shopController.getBankSeller.bind(shopController));
bankRouter.post('/', shopController.postBank.bind(shopController));
bankRouter.patch('/update', shopController.updateBank.bind(shopController));
bankRouter.delete('/delete', shopController.deleteBank.bind(shopController));
bankRouter.get('/all', shopController.getAllBank.bind(shopController));

export default bankRouter;
