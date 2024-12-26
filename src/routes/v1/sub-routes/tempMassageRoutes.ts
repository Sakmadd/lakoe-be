import { Router } from 'express';
import templateController from '../../../controllers/templateController';
import { authentication } from '../../../middlewares/authentication';

const templateRouter = Router();

templateRouter.get(
  '/',
  templateController.getTemplateMassage.bind(templateController),
);

templateRouter.post(
  '/template',
  templateController.createTemplates.bind(templateController),
);

templateRouter.patch(
  '/update/:id',
  templateController.updateTemplates.bind(templateController),
);

templateRouter.delete(
  '/delete/:id',
  templateController.deleteTemplates.bind(templateController),
);
templateRouter.get(
  '/sign/:id',
  authentication,
  templateController.assignTemplates.bind(templateController),
);
export default templateRouter;
