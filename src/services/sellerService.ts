import {
  getAllOrder,
  sellerGraphRes,
  sellerShopRes,
} from '../dtos/seller/sellerDTO';
import ServiceResponseDTO from '../dtos/serviceResponseDto';
import sellerRepo from '../repo/sellerRepo';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';

class dashboardService {
  async getDashboard(
    shop_id: string,
  ): Promise<ServiceResponseDTO<sellerShopRes | null>> {
    try {
      const dashboard = await sellerRepo.getDashboard(shop_id);
      return new ServiceResponseDTO<sellerShopRes>({
        error: false,
        message: null,
        payload: dashboard,
      });
    } catch (error) {
      return serviceErrorHandler<sellerShopRes | null>(error);
    }
  }

  async getGraph(
    shop_id: string,
  ): Promise<ServiceResponseDTO<sellerGraphRes[] | null>> {
    try {
      const graph = await sellerRepo.getGraph(shop_id);
      return new ServiceResponseDTO<sellerGraphRes[]>({
        error: false,
        message: null,
        payload: graph,
      });
    } catch (error) {
      return serviceErrorHandler<sellerGraphRes[] | null>(error);
    }
  }
  async getAllOrder(
    shop_id: string,
  ): Promise<ServiceResponseDTO<getAllOrder[] | null>> {
    try {
      const getAllOrder = await sellerRepo.getAllOrder(shop_id);

      return new ServiceResponseDTO<getAllOrder[]>({
        error: false,
        message: null,
        payload: getAllOrder,
      });
    } catch (error) {
      return serviceErrorHandler<getAllOrder[]>(error);
    }
  }

  // async getOrderByIdOrder(id: string): Promise<ServiceResponseDTO<>>{

  // }
}
export default new dashboardService();
