import { Request, Response } from 'express';
import shopService from '../services/shopService';

class shopController {
  async getShop(req: Request, res: Response) {
    const { id } = req.params;

    const shop = await shopService.getShopDetail(id);

    if (!shop) {
      return res.status(404).json({
        error: true,
        message: 'No shop found in the database',
        data: null,
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Shop Found',
      data: shop,
    });
  }

  async updateShop(req: Request, res: Response) {
    const { id } = req.params;
    const { name, phone, description, slogan, logo } = req.body;

    const shop = await shopService.updateShop({
      name,
      phone,
      description,
      slogan,
      logo,
      id,
    });

    if (!shop) {
      return res.status(404).json({
        error: true,
        message: 'No shop found in the database',
        data: null,
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Shop Updated',
      data: shop,
    });
  }

  async getLocationById(req: Request, res: Response) {
    const { id } = req.params;

    const location = await shopService.getLocationById(id);

    if (!location) {
      return res.status(404).json({
        error: true,
        message: 'No shop found',
        data: null,
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Location Found',
      data: location,
    });
  }

  async addLocationById(req: Request, res: Response) {
    const {
      name,
      address,
      city,
      district,
      postal_code,
      longitude,
      latitude,
      is_main,
    } = req.body;

    const { id } = req.params;

    const location = await shopService.addLocationById({
      name,
      address,
      city,
      district,
      postal_code,
      longitude,
      latitude,
      is_main,
      id,
    });

    if (!location) {
      return res.status(404).json({
        error: true,
        message: 'No shop found',
        data: null,
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Location Found',
      data: location,
    });
  }

  async updateLocationByLocationId(req: Request, res: Response) {
    const { id, location_id } = req.params;
    const {
      name,
      address,
      city,
      district,
      postal_code,
      longitude,
      latitude,
      is_main,
    } = req.body;

    const location = await shopService.updateLocationByLocationId({
      name,
      address,
      city,
      district,
      postal_code,
      longitude,
      latitude,
      is_main,
      id,
      location_id,
    });

    if (!location) {
      return res.status(404).json({
        error: true,
        message: 'No shop location found',
        data: null,
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Location Found',
      data: location,
    });
  }

  async deleteLocation(req: Request, res: Response) {
    const { id, location_id } = req.params;

    const location = await shopService.deleteLocation({
      id,
      location_id,
    });

    if (!location) {
      return res.status(404).json({
        error: true,
        message: 'No shop location found',
        data: null,
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Location Found',
      data: location,
    });
  }
}

export default new shopController();
