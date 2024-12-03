import ServiceResponseDTO from '../dtos/serviceResponseDto';
import { LocationType, ShopType } from '../types/types';
import * as shopRepo from '../repo/shopRepo';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';
import { ShopUpdateDTO } from '../dtos/shop/shopUpdateDTO';
import { addLocationDTO } from '../dtos/shop/addLocationDTO';
import { UpdateLocationDTO } from '../dtos/shop/updateLocationDTO';

class shopService {
  async getShopDetail(
    id: string,
  ): Promise<ServiceResponseDTO<ShopType | null>> {
    try {
      const shop = await shopRepo.getShopDetail(id);

      return new ServiceResponseDTO<ShopType>({
        error: false,
        message: null,
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

  async updateShop(
    data: ShopUpdateDTO,
  ): Promise<ServiceResponseDTO<ShopType | null>> {
    try {
      const shop = await shopRepo.updateShop(data);

      return new ServiceResponseDTO<ShopType>({
        error: false,
        message: null,
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
        message: null,
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
  ): Promise<ServiceResponseDTO<LocationType | null>> {
    try {
      const location = await shopRepo.addLocationById(data);

      return new ServiceResponseDTO<LocationType>({
        error: false,
        message: null,
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
    data: UpdateLocationDTO,
  ): Promise<ServiceResponseDTO<LocationType | null>> {
    try {
      const location = await shopRepo.updateLocationByLocationId(data);

      return new ServiceResponseDTO<LocationType>({
        error: false,
        message: null,
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

  async deleteLocation(data: {
    id: string;
    location_id: string;
  }): Promise<ServiceResponseDTO<LocationType | null>> {
    try {
      const location = await shopRepo.deleteLocation(data);

      return new ServiceResponseDTO<LocationType>({
        error: false,
        message: null,
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
}

export default new shopService();
