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

router.get(
  '/shop',
  authentication,
  productController.getProductsByShopId.bind(productController),
);

router.get('/search', productController.searchProducts.bind(productController));

router.get(
  '/categories',
  productController.getAllCategories.bind(productController),
);

router.patch(
  '/batch-toggle',
  authentication,
  productController.toggleProductsActive.bind(productController),
);

router.patch(
  '/price/:id',
  authentication,
  productController.updateProductPrice.bind(productController),
);

router.patch(
  '/stock/:id',
  authentication,
  productController.updateProductStock.bind(productController),
);

router.delete(
  '/batch-delete',
  authentication,
  productController.batchDelete.bind(productController),
);

router.get('/:id', productController.getProductById.bind(productController));

router.get(
  '/url/:url',
  productController.getProductByUrl.bind(productController),
);

router.patch(
  '/:id',
  authentication,
  upload.array('Images'),
  productController.updateProductById.bind(productController),
);

router.patch(
  '/:id/toggle',
  authentication,
  productController.toggleProductActive.bind(productController),
);

export default router;
