import { Request, response, Response } from 'express';
import shopService from '../services/shopService';
import { ShopUpdateDTO } from '../dtos/shop/shopUpdateDTO';
import ResponseDTO from '../dtos/responseDto';
import uploader from '../libs/cloudinary';
import { LocationType } from '../types/types';
import { updateMainLocation } from '../dtos/shop/updateLocationDTO';

class shopController {
  async getShop(req: Request, res: Response) {
    const { id } = req.params;

    const { error, message, payload } = await shopService.getShopDetail(id);

    if (error) {
      return res.status(404).json(
        new ResponseDTO<string>({
          error: error,
          message: message,
          data: null,
        }),
      );
    }

    return res.status(200).json(
      new ResponseDTO({
        error: error,
        message: message,
        data: payload,
      }),
    );
  }

  async getAllLocation(req: Request, res: Response) {
    const { id } = req.params;

    const { error, message, payload } = await shopService.getAllLocations(id);

    if (error) {
      return res.status(404).json(
        new ResponseDTO<string>({
          error: error,
          message: message,
          data: null,
        }),
      );
    }

    return res.status(200).json(
      new ResponseDTO({
        error: error,
        message: message,
        data: payload,
      }),
    );
  }
  async updateMainLocation(req: Request, res: Response) {
    const { id } = req.params;

    const body: updateMainLocation = req.body;

    const { error, message, payload } = await shopService.updateMainLocation(
      body,
      id,
    );

    if (error) {
      return res.status(404).json(
        new ResponseDTO({
          error: error,
          message: message,
          data: payload,
        }),
      );
    }

    return res.status(200).json(
      new ResponseDTO({
        error: error,
        message: message,
        data: payload,
      }),
    );
  }

  async updateShop(req: Request, res: Response) {
    const { id } = req.params;
    const id_shop = res.locals.user.shop_id;
    const body: ShopUpdateDTO = req.body;

    if (req.files && req.files['logo']) {
      const logoFile = (req.files['logo'] as Express.Multer.File[])[0];
      body.logo = await uploader(logoFile);
    }

    const { error, message, payload } = await shopService.updateShop(body, id);

    if (error) {
      return res.status(404).json(
        new ResponseDTO({
          error: error,
          message: message,
          data: payload,
        }),
      );
    }

    return res.status(200).json(
      new ResponseDTO({
        error: error,
        message: message,
        data: payload,
      }),
    );
  }

  async getLocationById(req: Request, res: Response) {
    const { id } = req.params;

    const { error, message, payload } = await shopService.getLocationById(id);

    if (error) {
      return res.status(404).json(
        new ResponseDTO({
          error: error,
          message: message,
          data: payload,
        }),
      );
    }

    return res.status(200).json(
      new ResponseDTO({
        error: error,
        message: message,
        data: payload,
      }),
    );
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

    const { error, message, payload } = await shopService.addLocationById(
      newLocation,
      id,
    );

    if (error) {
      return res.status(404).json(
        new ResponseDTO({
          error: error,
          message: message,
          data: null,
        }),
      );
    }

    return res.status(200).json(
      new ResponseDTO<LocationType>({
        error: error,
        message: message,
        data: payload,
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

    const { error, message, payload } =
      await shopService.updateLocationByLocationId(updateLocation, id);

    if (error) {
      return res.status(404).json(
        new ResponseDTO({
          error: error,
          message: message,
          data: payload,
        }),
      );
    }

    return res.status(200).json(
      new ResponseDTO({
        error: error,
        message: message,
        data: payload,
      }),
    );
  }

  async deleteLocation(req: Request, res: Response) {
    const { id } = req.params;

    const { error, message, payload } = await shopService.deleteLocation(id);

    if (error) {
      return res.status(404).json(
        new ResponseDTO({
          error: error,
          message: message,
          data: payload,
        }),
      );
    }

    return res.status(200).json(
      new ResponseDTO({
        error: error,
        message: message,
        data: payload,
      }),
    );
  }
}

export default new shopController();
