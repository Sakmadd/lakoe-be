import { Request, Response } from 'express';
import userService from '../services/userService';

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
      return res.status(404).json({
        error: true,
        message: 'No user found in the database',
        data: null,
      });
    }

    return res.status(200).json({
      error: false,
      message: 'user found',
      data: user,
    });
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email } = req.body;

    const user = await userService.updateUser({
      id,
      name,
      email,
    });
  }
}

export default new userController();
