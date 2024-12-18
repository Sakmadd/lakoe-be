import { CreateOrdersDTO } from '../dtos/orders/createOrders';
import { RatesRequestDTO } from '../dtos/orders/ratesOrder';
import ServiceResponseDTO from '../dtos/serviceResponseDto';
import orderRepo from '../repo/orderRepo';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';

class OrderServices {
  async createOrder(
    data: CreateOrdersDTO,
  ): Promise<ServiceResponseDTO<CreateOrdersDTO | null>> {
    try {
      await orderRepo.createOrder(data);
      return new ServiceResponseDTO<CreateOrdersDTO>({
        error: false,
        message: null,
        payload: null,
      });
    } catch (error) {
      return serviceErrorHandler<CreateOrdersDTO | null>(error);
    }
  }

  // async shipmentRates(data: RatesRequestDTO): Promise<ServiceResponseDTO<RatesDTO | null>> {
  //   try {

  //     const rates = await orderRepo.shipmentRates(data);

  //     return new ServiceResponseDTO<RatesDTO>({
  //       error: false,
  //       message: null,
  //       payload: rates,
  //     });

  //   } catch (error) {

  //   }
  // }
}

export default new OrderServices();
