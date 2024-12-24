import ServiceResponseDTO from '../dtos/serviceResponseDto';
import { MidtransDTO, MidtransResponse } from '../dtos/webhook/midtrans';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';
import * as webhookRepo from '../repo/webhookRepo';

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
}

export default new webhookService();
