import { Router } from 'express';
import templateController from '../../../controllers/templateController';

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

export default templateRouter;
