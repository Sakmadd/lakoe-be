import ServiceResponseDTO from '../dtos/serviceResponseDto';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';
import * as withdrawRepo from '../repo/withdrawRepo';
import { WithdrawDTO } from '../dtos/withdraw/withdrawDTO';

class withdrawService {
  async getAllWithdraw(): Promise<ServiceResponseDTO<WithdrawDTO[] | null>> {
    try {
      const withdraw = await withdrawRepo.getAllWithdraw();

      return new ServiceResponseDTO<WithdrawDTO[]>({
        error: false,
        message: null,
        payload: withdraw,
      });
    } catch (error) {
      return serviceErrorHandler<WithdrawDTO[] | null>({
        error: true,
        message: error.message,
        payload: null,
      });
    }
  }
  async createWithdraw(
    amount: number,
    id: string,
  ): Promise<ServiceResponseDTO<CreateWithdrawDTO | null>> {
    try {
    } catch (error) {}
  }
}

export default new withdrawService();
