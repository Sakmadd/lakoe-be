import { Router } from 'express';
import dashboadController from '../../../controllers/dashboadController';
import { authentication } from '../../../middlewares/authentication';

const dashboardRouter = Router();

dashboardRouter.get(
  '/',
  authentication,
  dashboadController.getDashboard.bind(dashboadController),
);
export default dashboardRouter;
