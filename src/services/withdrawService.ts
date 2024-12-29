import { GetAllWithdrawSellerDTO } from '../dtos/seller/getAllWithdrawSellerDTO';
import ServiceResponseDTO from '../dtos/serviceResponseDto';
import { CreateWithdrawDTO } from '../dtos/withdraw/createWithdrawDTO';
import { updateWithdrawDTO } from '../dtos/withdraw/updateWithdrawDTO';
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
  async updateWithDraw(body: updateWithdrawDTO) {
    try {
      const wd = await withdrawRepo.updateWithdraw(body);

      if (!wd) {
        return {
          error: true,
          message: 'failed update withdraw',
          data: wd,
        };
      }

      if (body.status === 'rejected') {
        return {
          error: false,
          message: 'success',
          data: wd,
        };
      }

      const result = await withdrawRepo.handleAcceptedWithdraw(
        wd.shop_id,
        wd.id,
      );

      return {
        error: false,
        message: 'success',
        data: {
          wd,
          result,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getWithdrawById(
    shop_id: string,
  ): Promise<ServiceResponseDTO<GetAllWithdrawSellerDTO[] | null>> {
    try {
      const getById = await withdrawRepo.getAllWithdrawSeller(shop_id);
      return new ServiceResponseDTO<GetAllWithdrawSellerDTO[]>({
        error: false,
        message: null,
        payload: getById,
      });
    } catch (error) {
      return serviceErrorHandler<null>(error);
    }
  }

  async getAllWithdrawSeller(
    id: string,
  ): Promise<ServiceResponseDTO<GetAllWithdrawSellerDTO[] | null>> {
    try {
      const withdraw = await withdrawRepo.getAllWithdrawSeller(id);

      return new ServiceResponseDTO<GetAllWithdrawSellerDTO[]>({
        error: false,
        message: null,
        payload: withdraw,
      });
    } catch (error) {
      return serviceErrorHandler<null>(error);
    }
  }
}

export default new withdrawService();
