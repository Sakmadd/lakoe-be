import ServiceResponseDTO from '../dtos/serviceResponseDto';
import { ShopType } from '../types/types';
import * as shopRepo from '../repo/shopRepo';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';
import { ShopUpdateDTO } from '../dtos/shop/shopUpdateDTO';

class shopService {
  async getShopDetail(id): Promise<ServiceResponseDTO<ShopType | null>> {
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
  ): Promise<ServiceResponseDTO<ShopUpdateDTO | null>> {
    try {
      const shop = await shopRepo.updateShop(data);

      return new ServiceResponseDTO<ShopUpdateDTO>({
        error: false,
        message: null,
        payload: shop,
      });
    } catch (error) {}
  }
}

export default new shopService();
