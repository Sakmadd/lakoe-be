import { Request, Response } from 'express';
import shopService from '../services/shopService';
import { ShopUpdateDTO } from '../dtos/shop/shopUpdateDTO';
import ResponseDTO from '../dtos/responseDto';
import uploader from '../libs/cloudinary';
import { LocationType } from '../types/types';
import { updateMainLocation } from '../dtos/shop/updateLocationDTO';
import { bankAccount } from '../dtos/bankAccount/createBank';

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

  async getAllLocation(req: Request, res: Response) {
    const { id } = req.params;

    const location = await shopService.getAllLocations(id);

    if (!location) {
      return res.status(404).json(
        new ResponseDTO<string>({
          error: true,
          message: 'No Location found in the database',
          data: null,
        }),
      );
    }

    return res.status(200).json({
      error: false,
      message: 'location Found',
      data: location,
    });
  }
  async updateMainLocation(req: Request, res: Response) {
    const { id } = req.params;

    const body: updateMainLocation = req.body;

    const shop = await shopService.updateMainLocation(body, id);

    if (!shop) {
      res.status(404).json({
        error: true,
        message: 'No shop found',
      });
    } else {
      res.status(200).json({
        error: false,
        message: 'Main Location Updated',
      });
    }
  }
  async updateShop(req: Request, res: Response) {
    const { id } = req.params;
    const id_shop = res.locals.user.shop_id;
    const body: ShopUpdateDTO = req.body;

    if (req.files && req.files['logo']) {
      const logoFile = (req.files['logo'] as Express.Multer.File[])[0];
      body.logo = await uploader(logoFile);
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
      province,
      city,
      district,
      subdistrict,
      address,
      postal_code,
      longitude,
      latitude,
      is_main,
    } = req.body;

    const newLocation = {
      name,
      province,
      city,
      district,
      subdistrict,
      address,
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

    return res.status(200).json(
      new ResponseDTO<LocationType>({
        error: false,
        message: 'Location Created',
        data: location,
      }),
    );
  }

  async updateLocationByLocationId(req: Request, res: Response) {
    const { id } = req.params;

    const {
      name,
      province,
      city,
      district,
      subdistrict,
      address,
      postal_code,
      longitude,
      latitude,
      is_main,
    } = req.body;

    const updateLocation = {
      name,
      province,
      city,
      district,
      subdistrict,
      address,
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

  async postBank(req: Request, res: Response) {
    const shop_id = res.locals.user.shop_id;
    const body: bankAccount = req.body;
    const post = await shopService.postBank(shop_id, body);

    if (!post) {
      return res.status(404).json({
        error: true,
        message: 'No bank cannot created',
        data: null,
      });
    } else {
      return res.status(200).json({
        error: false,
        message: 'Bank created successfully',
        data: post,
      });
    }
  }
  async updateBank(req: Request, res: Response) {
    const shop_id = res.locals.user.shop_id;
    const body: bankAccount = req.body;
    const update = await shopService.updateBank(shop_id, body);

    if (!update) {
      return res.status(404).json({
        error: true,
        message: 'No bank cannot updated',
        data: null,
      });
    } else {
      return res.status(200).json({
        error: false,
        message: 'Bank updated successfully',
        data: update,
      });
    }
  }
  async deleteBank(req: Request, res: Response) {
    const shop_id = res.locals.user.shop_id;
    const deleteBank = await shopService.deleteBank(shop_id);

    if (!deleteBank) {
      return res.status(404).json({
        error: true,
        message: 'No bank cannot deleted',
        data: null,
      });
    } else {
      return res.status(200).json({
        error: false,
        message: 'Bank deleted successfully',
        data: deleteBank,
      });
    }
  }
}

export default new shopController();
