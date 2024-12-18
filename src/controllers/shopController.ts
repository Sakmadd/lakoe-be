import { Request, Response } from 'express';
import shopService from '../services/shopService';
import { ShopUpdateDTO } from '../dtos/shop/shopUpdateDTO';
import ResponseDTO from '../dtos/responseDto';

class shopController {
  async getShop(req: Request, res: Response) {
    const { id } = req.params;

    const shop = await shopService.getShopDetail(id);

    if (!shop) {
      return res.status(404).json(
        new ResponseDTO<string>({
          error: true,
          message: 'No shop found in the database',
          data: null,
        }),
      );
    }

    return res.status(200).json({
      error: false,
      message: 'Shop Found',
      data: shop,
    });
  }

  async updateShop(req: Request, res: Response) {
    const { id } = req.params;
    const id_shop = res.locals.user.shop_id;
    const body: ShopUpdateDTO = req.body;

    if (req.files) {
      const files = req.files as { [key: string]: Express.Multer.File[] };
      Object.keys(files).map((key) => {
        body[key] = files[key];
      });
    }
    const shop = await shopService.updateShop(body, id);

    if (!shop) {
      return res.status(404).json({
        error: true,
        message: 'No shop found in the database',
        data: null,
      });
    } else if (id_shop !== id) {
      return res.status(404).json({
        error: true,
        message: 'you cannot access this shop',
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

    const newLocation = {
      name,
      address,
      city,
      district,
      postal_code,
      longitude,
      latitude,
      is_main,
    };

    req.body = newLocation;

    const { id } = req.params;

    const location = await shopService.addLocationById(newLocation, id);

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
    const { id } = req.params;

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

    const updateLocation = {
      name,
      address,
      city,
      district,
      postal_code,
      longitude,
      latitude,
      is_main,
    };

    req.body = updateLocation;

    const location = await shopService.updateLocationByLocationId(
      updateLocation,
      id,
    );

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
    const { id } = req.params;

    const location = await shopService.deleteLocation(id);

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
