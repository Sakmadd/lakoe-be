import { Router } from 'express';
import shopController from '../../../controllers/shopController';
import upload from '../../../middlewares/upload-file';

const router = Router();

router.get('/:id', shopController.getShop.bind(shopController));
router.get('/location/:id', shopController.getAllLocation.bind(shopController));

router.patch(
  '/location/:id',
  shopController.updateMainLocation.bind(shopController),
);
router.patch(
  '/:id',
  upload.fields([{ name: 'logo', maxCount: 1 }]),
  shopController.updateShop.bind(shopController),
);

router.post(
  '/locations/:id',
  shopController.addLocationById.bind(shopController),
);

router.patch(
  '/locations/:id',
  shopController.updateLocationByLocationId.bind(shopController),
);

router.delete(
  '/locations/:id',
  shopController.deleteLocation.bind(shopController),
);

router.post('/bank', shopController.postBank.bind(shopController));
router.patch('/bank/update', shopController.updateBank.bind(shopController));
router.delete('/bank/delete', shopController.deleteBank.bind(shopController));
export default router;
