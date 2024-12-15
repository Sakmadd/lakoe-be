import { CreateOrdersDTO } from '../dtos/orders/createOrders';
import ServiceResponseDTO from '../dtos/serviceResponseDto';
import orderRepo from '../repo/orderRepo';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';

class OrderServices {
  async createOrder(
    data: CreateOrdersDTO,
  ): Promise<ServiceResponseDTO<CreateOrdersDTO | null>> {
    try {
      const order = await orderRepo.createOrder(data);
      return new ServiceResponseDTO<CreateOrdersDTO>({
        error: false,
        message: null,
        payload: null,
      });
    } catch (error) {
      return serviceErrorHandler<CreateOrdersDTO | null>(error);
    }
  }
}

export default new OrderServices();
