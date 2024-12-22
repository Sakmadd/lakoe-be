import RegisterDto from '../dtos/authentication/registerDto';
import ServiceResponseDTO from '../dtos/serviceResponseDto';
import jwt from 'jsonwebtoken';
import { UserType } from '../types/types';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';
import { validationErrorHandler } from '../utils/validationErrorHandler';
import { loginSchema, registerSchema } from '../validator/dataSchema';
import { loginRepo, registerRepo } from '../repo/authRepo';
import LoginDTO from '../dtos/authentication/loginDTO';
import { CONFIGS } from '../config/config';

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
  async login(data: LoginDTO): Promise<ServiceResponseDTO<string>> {
    try {
      const { success, error } = loginSchema.safeParse(data);

      if (!success) {
        throw new Error(`Validation Error: ${validationErrorHandler(error)}`);
      }

      const user = await loginRepo(data);

      const token = jwt.sign(user, CONFIGS.JWT_SECRET);

      return new ServiceResponseDTO<string>({
        error: false,
        payload: token,
        message: null,
      });
    } catch (error) {
      return serviceErrorHandler<string>(error);
    }
  }
}

export default new AuthServices();
