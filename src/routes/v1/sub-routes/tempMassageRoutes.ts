import { Router } from 'express';
import templateController from '../../../controllers/templateController';

const templateRouter = Router();

templateRouter.get('/', templateController.getTemplateMassage);

export default templateRouter;
