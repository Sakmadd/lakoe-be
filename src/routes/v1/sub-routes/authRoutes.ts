import { Router } from 'express';
import authController from '../../../controllers/authController';
import { authentication } from '../../../middlewares/authentication';

const router = Router();
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.get(
  '/checkAuth',
  authentication,
  authController.checkAuth.bind(authController),
);
export default router;
