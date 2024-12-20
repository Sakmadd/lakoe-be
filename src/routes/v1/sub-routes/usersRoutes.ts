import { Router } from 'express';
import userController from '../../../controllers/userController';
import { authentication } from '../../../middlewares/authentication';

const router = Router();

router.get('/', userController.getAllUsers.bind(userController));

router.get(':id', userController.getUserById.bind(userController));

router.get(
  '/self',
  authentication,
  userController.getLoggedUser.bind(userController),
);

router.patch(':id', userController.updateUser.bind(userController));

export default router;
