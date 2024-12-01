import { PrismaClient } from '@prisma/client';
import RegisterDto from '../dtos/registerDto';
import ServiceResponseDTO from '../dtos/serviceResponseDto';
import { UserType } from '../types/types';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';
import { validationErrorHandler } from '../utils/validationErrorHandler';
import { registerSchema } from '../validator/dataSchema';
import hasher from '../utils/hasher';
import { registerRepo } from '../repo/authRepo';

const prisma = new PrismaClient();

class AuthServices {
  async register(
    data: RegisterDto,
  ): Promise<ServiceResponseDTO<UserType | null>> {
    try {
      const { success, error } = registerSchema.safeParse(data);
      if (!success) {
        throw new Error(`Validation Error: ${validationErrorHandler(error)}`);
      }

      const user = await registerRepo(data);

      return new ServiceResponseDTO<UserType>({
        error: false,
        payload: user,
        message: null,
      });
    } catch (error) {
      return serviceErrorHandler<UserType | null>(error);
    }
  }
}

export default new AuthServices();
