import ServiceResponseDTO from '../dtos/serviceResponseDto';
import { MidtransDTO, MidtransResponse } from '../dtos/webhook/midtrans';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';
import * as webhookRepo from '../repo/webhookRepo';
import {
  BiteshipStatusRequestDTO,
  BiteshipStatusResponseDTO,
} from '../dtos/webhook/biteshipStatus';

class webhookService {
  async postMidtrans(
    notificationJSON: MidtransDTO,
  ): Promise<ServiceResponseDTO<MidtransResponse | null>> {
    try {
      const response = await webhookRepo.postMidtrans(notificationJSON);

      return new ServiceResponseDTO<MidtransResponse>({
        error: false,
        message: 'Webhook catched',
        payload: response,
      });
    } catch (error) {
      return serviceErrorHandler<null>(error);
    }
  }

  async biteshipStatus(
    data: BiteshipStatusRequestDTO,
  ): Promise<ServiceResponseDTO<BiteshipStatusResponseDTO | null>> {
    try {
      const response = await webhookRepo.biteshipStatus(data);

      return new ServiceResponseDTO<BiteshipStatusResponseDTO>({
        error: false,
        message: 'Webhook catched',
        payload: response,
      });
    } catch (error) {
      return serviceErrorHandler<null>(error);
    }
  }
}

export default new webhookService();
