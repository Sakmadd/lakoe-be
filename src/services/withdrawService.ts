import ServiceResponseDTO from '../dtos/serviceResponseDto';
import { CreateWithdrawDTO } from '../dtos/withdraw/createWithdrawDTO';
import {
  updateWithdrawDTO,
  updateWithDrawID,
} from '../dtos/withdraw/updateWithdrawDTO';
import { WithdrawDTO } from '../dtos/withdraw/withdrawDTO';
import * as withdrawRepo from '../repo/withdrawRepo';
import { WithdrawType } from '../types/types';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';

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
  async updateWithDraw(
    { shop_id, id }: updateWithDrawID,
    body: updateWithdrawDTO,
  ) {
    const update = await withdrawRepo.updateWithdraw(
      {
        shop_id,
        id,
      },
      body,
    );
  }
  async getWithdrawById(
    shop_id: string,
  ): Promise<ServiceResponseDTO<WithdrawDTO[] | null>> {
    try {
      const getById = await withdrawRepo.getWithdrawById(shop_id);
      return new ServiceResponseDTO<WithdrawDTO[]>({
        error: false,
        message: null,
        payload: getById,
      });
    } catch (error) {
      return serviceErrorHandler<WithdrawDTO[] | null>(error);
    }
  }
}

export default new withdrawService();
