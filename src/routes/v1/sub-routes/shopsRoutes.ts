import { Router } from 'express';
import shopController from '../../../controllers/shopController';
import upload from '../../../middlewares/upload-file';
import { authentication } from '../../../middlewares/authentication';

const router = Router();

router.get('/:id', shopController.getShop.bind(shopController));

router.patch(
  '/:id',
  upload.single('logo'),
  shopController.updateShop.bind(shopController),
);

router.patch(
  '/:id/locations',
  shopController.getLocationById.bind(shopController),
);

router.post(
  '/:id/locations',
  shopController.addLocationById.bind(shopController),
);

router.patch(
  '/:id/locations/:location_id',
  shopController.updateLocationByLocationId.bind(shopController),
);

router.delete(
  '/:id/locations/:location_id',
  shopController.deleteLocation.bind(shopController),
);

export default router;
