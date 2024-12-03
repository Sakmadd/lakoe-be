import { Router } from 'express';
import userController from '../../../controllers/userController';

const router = Router();

router.get('/users', userController.getAllUsers.bind(userController));

router.get('/users/:id', userController.getUserById.bind(userController));

router.patch('/users/:id', userController.updateUser.bind(userController));

export default router;
