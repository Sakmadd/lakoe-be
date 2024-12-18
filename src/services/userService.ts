import ServiceResponseDTO from '../dtos/serviceResponseDto';
import { UserDetailType, UserType } from '../types/types';
import * as userRepo from '../repo/userRepo';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';
import { UpdateUserDTO } from '../dtos/user/updateUser';

class userServices {
  async getAllUsers(): Promise<ServiceResponseDTO<UserDetailType[] | null>> {
    try {
      const users = await userRepo.getAllUser();

      return new ServiceResponseDTO<UserDetailType[]>({
        error: false,
        message: null,
        payload: users,
      });
    } catch (error) {
      return serviceErrorHandler<UserDetailType[] | null>({
        error: true,
        message: error.message,
        payload: null,
      });
    }
  }

  async getUserById(
    id: string,
  ): Promise<ServiceResponseDTO<UserDetailType | null>> {
    try {
      const user = await userRepo.getUserById(id);

      return new ServiceResponseDTO<UserDetailType>({
        error: false,
        message: null,
        payload: user,
      });
    } catch (error) {
      return serviceErrorHandler<UserDetailType | null>({
        error: true,
        message: error.message,
        payload: null,
      });
    }
  }

  async updateUser(
    data: UpdateUserDTO,
  ): Promise<ServiceResponseDTO<UserType | null>> {
    try {
      const user = await userRepo.updateUser(data);

      return new ServiceResponseDTO<UserType>({
        error: false,
        message: null,
        payload: user,
      });
    } catch (error) {
      return serviceErrorHandler<UserDetailType | null>({
        error: true,
        message: error.message,
        payload: null,
      });
    }
  }

  async getLoggedUser(
    loggedUser: UserType,
  ): Promise<ServiceResponseDTO<UserDetailType>> {
    try {
      const user = await userRepo.getLoggedUser(loggedUser);

      return new ServiceResponseDTO<UserDetailType>({
        error: false,
        message: null,
        payload: user,
      });
    } catch (error) {
      return serviceErrorHandler<UserDetailType | null>({
        error: true,
        message: error.message,
        payload: null,
      });
    }
  }
}

export default new userServices();
