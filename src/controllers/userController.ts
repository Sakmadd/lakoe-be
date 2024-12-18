import { Request, Response } from 'express';
import userService from '../services/userService';
import ServiceResponseDTO from '../dtos/serviceResponseDto';
import { UserDetailType } from '../types/types';
import ResponseDTO from '../dtos/responseDto';

class userController {
  async getAllUsers(req: Request, res: Response) {
    const users = await userService.getAllUsers();

    if (!users) {
      return res.status(404).json({
        error: true,
        message: 'No user found in the database',
        data: null,
      });
    }

    return res.status(200).json({
      error: false,
      message: 'user found',
      data: users,
    });
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;

    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json(
        new ResponseDTO<UserDetailType>({
          error: true,
          message: 'No user found in the database',
          data: null,
        }),
      );
    }

    return res.status(200).json(
      new ResponseDTO<UserDetailType>({
        error: false,
        message: 'user found',
        data: user,
      }),
    );
  }

  async updateUser(req: Request) {
    const { id } = req.params;
    const { name, email } = req.body;

    await userService.updateUser({
      id,
      name,
      email,
    });
  }

  async getLoggedUser(req: Request, res: Response) {
    const loggedUser = res.locals.user;

    const user = await userService.getLoggedUser(loggedUser);

    if (!user) {
      return res.status(404).json(
        new ResponseDTO<UserDetailType>({
          error: true,
          message: 'No user found in the database',
          data: null,
        }),
      );
    }

    return res.status(200).json(
      new ResponseDTO<UserDetailType>({
        error: false,
        message: 'user found',
        data: user,
      }),
    );
  }

  async checkUser(req: Request, res: Response) {
    const { id } = res.locals.user.id;

    console.log(id);

    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json(
        new ResponseDTO<UserDetailType>({
          error: true,
          message: 'No user found in the database',
          data: null,
        }),
      );
    }

    return res.status(200).json(
      new ResponseDTO<UserDetailType>({
        error: false,
        message: 'user found',
        data: user,
      }),
    );
  }
}

export default new userController();
