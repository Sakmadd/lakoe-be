// import { CreateOrdersDTO } from '../dtos/orders/createOrders';
import {
  CreateOrderRequestDTO,
  CreateOrderResponseDTO,
} from '../dtos/orders/createOrderV2';
import { RatesRequestDTO, RatesResponseDTO } from '../dtos/orders/ratesOrder';
import ServiceResponseDTO from '../dtos/serviceResponseDto';
import * as orderRepo from '../repo/orderRepo';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';

class OrderServices {
  async createOrder(
    data: CreateOrderRequestDTO,
  ): Promise<ServiceResponseDTO<CreateOrderResponseDTO | null>> {
    try {
      const order = await orderRepo.createOrder(data);

      return new ServiceResponseDTO<CreateOrderResponseDTO>({
        error: false,
        message: null,
        payload: order,
      });
    } catch (error) {
      return serviceErrorHandler<CreateOrderResponseDTO | null>(error);
    }
  }

  async shipmentRates(
    data: RatesRequestDTO,
  ): Promise<ServiceResponseDTO<RatesResponseDTO[] | null>> {
    try {
      const rates = await orderRepo.shipmentRates(data);

      return new ServiceResponseDTO<RatesResponseDTO[]>({
        error: false,
        message: null,
        payload: rates,
      });
    } catch (error) {
      return serviceErrorHandler<null>(error);
    }
  }
}

export default new OrderServices();
