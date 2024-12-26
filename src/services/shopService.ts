import ServiceResponseDTO from '../dtos/serviceResponseDto';
import { LocationType, ShopType } from '../types/types';
import * as shopRepo from '../repo/shopRepo';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';
import { ShopUpdateDTO } from '../dtos/shop/shopUpdateDTO';
import { addLocationDTO } from '../dtos/shop/addLocationDTO';
import {
  UpdateLocationDTO,
  updateMainLocation,
} from '../dtos/shop/updateLocationDTO';
import uploader from '../libs/clodudinary2.0';

class shopService {
  async getShopDetail(
    id: string,
  ): Promise<ServiceResponseDTO<ShopType | null>> {
    try {
      const shop = await shopRepo.getShopDetail(id);

      return new ServiceResponseDTO<ShopType>({
        error: false,
        message: 'Shop Found',
        payload: shop,
      });
    } catch (error) {
      return serviceErrorHandler<ShopType | null>({
        error: true,
        message: error.message,
        payload: null,
      });
    }
  }

  async getAllLocations(
    id: string,
  ): Promise<ServiceResponseDTO<addLocationDTO[] | null>> {
    try {
      const locations = await shopRepo.getAllLocations(id);
      return new ServiceResponseDTO<addLocationDTO[]>({
        error: false,
        message: "shop's locations",
        payload: locations,
      });
    } catch (error) {
      return serviceErrorHandler<addLocationDTO[] | null>(error);
    }
  }

  async updateMainLocation(
    body: updateMainLocation,
    id: string,
  ): Promise<ServiceResponseDTO<updateMainLocation | null>> {
    try {
      const updateMainLocation = await shopRepo.updateMainLocation(body, id);
      return new ServiceResponseDTO<updateMainLocation>({
        error: false,
        message: null,
        payload: updateMainLocation,
      });
    } catch (error) {
      return serviceErrorHandler<updateMainLocation>(error);
    }
  }
  async updateShop(
    body: ShopUpdateDTO,
    id: string,
  ): Promise<ServiceResponseDTO<ShopType | null>> {
    try {
      await Promise.all(
        Object.entries(body).map(async ([key, value]) => {
          if (typeof value !== 'string') {
            const src = (await uploader(value))[0].src;

            body[key] = src;
          }
        }),
      );
      const shop = await shopRepo.updateShop(body, id);

      return new ServiceResponseDTO<ShopType>({
        error: false,
        message: 'Shop Updated',
        payload: shop,
      });
    } catch (error) {
      return serviceErrorHandler<ShopType | null>({
        error: true,
        message: error.message,
        payload: null,
      });
    }
  }

  async getLocationById(
    id: string,
  ): Promise<ServiceResponseDTO<LocationType[] | null>> {
    try {
      const location = await shopRepo.getLocationById(id);

      return new ServiceResponseDTO<LocationType[]>({
        error: false,
        message: 'Location Found',
        payload: location,
      });
    } catch (error) {
      return serviceErrorHandler<LocationType[] | null>({
        error: true,
        message: error.message,
        payload: null,
      });
    }
  }

  async addLocationById(
    data: addLocationDTO,
    id: string,
  ): Promise<ServiceResponseDTO<LocationType | null>> {
    try {
      const location = await shopRepo.addLocationById(data, id);

      return new ServiceResponseDTO<LocationType>({
        error: false,
        message: 'location has already been added',
        payload: location,
      });
    } catch (error) {
      return serviceErrorHandler<LocationType | null>({
        error: true,
        message: error.message,
        payload: null,
      });
    }
  }

  async updateLocationByLocationId(
    updateLocation: UpdateLocationDTO,
    id: string,
  ): Promise<ServiceResponseDTO<LocationType | null>> {
    try {
      const location = await shopRepo.updateLocationByLocationId(
        updateLocation,
        id,
      );

      return new ServiceResponseDTO<LocationType>({
        error: false,
        message: 'location update',
        payload: location,
      });
    } catch (error) {
      return serviceErrorHandler<LocationType | null>({
        error,
      });
    }
  }

  async deleteLocation(
    id: string,
  ): Promise<ServiceResponseDTO<LocationType | null>> {
    try {
      await shopRepo.deleteLocation(id);

      return new ServiceResponseDTO<LocationType>({
        error: false,
        message: 'location has already been deleted',
        payload: null,
      });
    } catch (error) {
      return serviceErrorHandler<LocationType | null>({
        error: true,
        message: error.message,
        payload: null,
      });
    }
  }
}

export default new shopService();
