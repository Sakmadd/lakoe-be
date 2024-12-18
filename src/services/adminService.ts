import { CategoryDTO } from '../dtos/admin/categoryDTO';
import { InvoiceDTO } from '../dtos/admin/transactionDTO';
import { UserDTO } from '../dtos/admin/userDTO';
import { WithdrawDTO } from '../dtos/admin/withdrawDTO';
import ServiceResponseDTO from '../dtos/serviceResponseDto';
import * as adminRepo from '../repo/adminRepo';
import { BalanceType } from '../types/types';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';

class AdminService {
  async getAllBalance(): Promise<ServiceResponseDTO<BalanceType | null>> {
    try {
      const balance = await adminRepo.getAllBalance();

      return new ServiceResponseDTO<BalanceType>({
        error: false,
        message: null,
        payload: balance,
      });
    } catch (error) {
      return serviceErrorHandler<BalanceType | null>({
        error: true,
        message: error.message,
        payload: null,
      });
    }
  }

  // async getAllTransaction(): Promise<ServiceResponseDTO<InvoiceDTO[] | null>> {
  //   try {
  //     const transaction = await adminRepo.getAllTransaction();

  //     return new ServiceResponseDTO<InvoiceDTO[]>({
  //       error: false,
  //       message: null,
  //       payload: transaction,
  //     });
  //   } catch (error) {
  //     return serviceErrorHandler<InvoiceDTO[] | null>({
  //       error: true,
  //       message: error.message,
  //       payload: null,
  //     });
  //   }
  // }

  async getAllUsers(): Promise<ServiceResponseDTO<UserDTO[] | null>> {
    try {
      const users = await adminRepo.getAllUsers();

      return new ServiceResponseDTO<UserDTO[]>({
        error: false,
        message: null,
        payload: users,
      });
    } catch (error) {
      return serviceErrorHandler<UserDTO[] | null>({
        error: true,
        message: error.message,
        payload: null,
      });
    }
  }

  async getAllCategory(): Promise<ServiceResponseDTO<CategoryDTO[] | null>> {
    try {
      const categories = await adminRepo.getAllCategory();

      return new ServiceResponseDTO<CategoryDTO[]>({
        error: false,
        message: null,
        payload: categories,
      });
    } catch (error) {
      return serviceErrorHandler<CategoryDTO[] | null>({
        error: true,
        message: error.message,
        payload: null,
      });
    }
  }

  async getAllWithdraw(): Promise<ServiceResponseDTO<WithdrawDTO[] | null>> {
    try {
      const withdraw = await adminRepo.getAllWithdraw();

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
}

export default new AdminService();
