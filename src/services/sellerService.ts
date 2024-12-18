import { sellerShopRes } from '../dtos/seller/sellerDTO';
import ServiceResponseDTO from '../dtos/serviceResponseDto';
import sellerRepo from '../repo/sellerRepo';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';

class dashboardService {
  async getDashboard(
    userId: string,
  ): Promise<ServiceResponseDTO<sellerShopRes | null>> {
    try {
      const dashboard = await sellerRepo.getDashboard(userId);
      return new ServiceResponseDTO<sellerShopRes>({
        error: false,
        message: null,
        payload: dashboard,
      });
    } catch (error) {
      return serviceErrorHandler<sellerShopRes | null>({
        error: true,
        message: error.message,
        payload: null,
      });
    }
  }
}
export default new dashboardService();
