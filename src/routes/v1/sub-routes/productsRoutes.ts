import { Router } from 'express';
import productController from '../../../controllers/productController';
import { authentication } from '../../../middlewares/authentication';
import upload from '../../../middlewares/upload-file';

const router = Router();

router.get('/', productController.getAllProducts.bind(productController));

router.post(
  '/',
  authentication,
  upload.array('Images'),
  productController.createProduct.bind(productController),
);

router.delete(
  '/',
  authentication,
  productController.deleteProducts.bind(productController),
);

router.get('/search', productController.searchProducts.bind(productController));

router.get('/:id', productController.getProductById.bind(productController));

export default router;
