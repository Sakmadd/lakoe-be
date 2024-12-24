import ServiceResponseDTO from '../dtos/serviceResponseDto';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';
import * as withdrawRepo from '../repo/withdrawRepo';
import { WithdrawDTO } from '../dtos/withdraw/withdrawDTO';
import { CreateWithdrawDTO } from '../dtos/withdraw/createWithdrawDTO';
import { WithdrawType } from '../types/types';

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
  async createWithDraw(
    body: CreateWithdrawDTO,
    shop_id: string,
  ): Promise<ServiceResponseDTO<WithdrawType | null>> {
    try {
      const withdraw = await withdrawRepo.createWithdraw(body, shop_id);

      return new ServiceResponseDTO<WithdrawType>({
        error: false,
        message: null,
        payload: withdraw,
      });
    } catch (error) {
      return serviceErrorHandler<WithdrawType | null>(error);
    }
  }
}

export default new withdrawService();
