import ResponseDTO from '../dtos/responseDto';
import ServiceResponseDTO from '../dtos/serviceResponseDto';
import authService from '../services/authService';
import { UserType } from '../types/types';
import { Request, Response } from 'express';

class AuthControllers {
  async register(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const { error, message, payload }: ServiceResponseDTO<UserType | null> =
      await authService.register({
        name,
        email,
        password,
      });
    if (error) {
      return res.status(400).json(
        new ResponseDTO<null>({
          error,
          message: message,
          data: payload,
        }),
      );
    }
    return res.status(200).json(
      new ResponseDTO<UserType>({
        error,
        message: {
          status: 'User created!',
        },
        data: payload,
      }),
    );
  }
}

export default new AuthControllers();
