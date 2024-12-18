import { Router } from 'express';
import shopController from '../../../controllers/shopController';
import upload from '../../../middlewares/upload-file';

const router = Router();

router.get('/:id', shopController.getShop.bind(shopController));

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

export default router;
