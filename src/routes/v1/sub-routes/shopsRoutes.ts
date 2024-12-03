import { Router } from 'express';
import shopController from '../../../controllers/shopController';

const router = Router();

router.get('/shops/:id', shopController.getShop.bind(shopController));
router.get(
  '/shops/:id/locations',
  shopController.getLocationById.bind(shopController),
);
router.post(
  '/shops/:id/locations',
  shopController.addLocationById.bind(shopController),
);
router.patch(
  '/shops/:id/locations/:location_id',
  shopController.updateLocationByLocationId.bind(shopController),
);
router.delete(
  '/shops/:id/locations/:location_id',
  shopController.deleteLocation.bind(shopController),
);

export default router;
