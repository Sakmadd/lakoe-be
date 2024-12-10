import { Request, Response } from 'express';
import adminService from '../services/adminService';

class adminController {
  async getAllBalance(req: Request, res: Response) {
    const balance = await adminService.getAllBalance();

    if (!balance) {
      return res.status(404).json({
        error: true,
        message: 'No balance found',
        data: null,
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Total Application Balance',
      data: balance,
    });
  }

  async getAllTransaction(req: Request, res: Response) {
    const transaction = await adminService.getAllTransaction();

    if (!transaction) {
      return res.status(404).json({
        error: true,
        message: 'No transaction found',
        data: null,
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Transactions found',
      data: transaction,
    });
  }

  async getAllUser(req: Request, res: Response) {
    const user = await adminService.getAllUsers();
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'No user found',
        data: null,
      });
    }

    return res.status(200).json({
      error: false,
      message: 'User found',
      data: user,
    });
  }

  async getAllCategory(req: Request, res: Response) {
    const categories = await adminService.getAllCategory();

    if (!categories) {
      return res.status(404).json({
        error: true,
        message: 'No categories found',
        data: null,
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Categories found',
      data: categories,
    });
  }

  async getAllWithdraw(req: Request, res: Response) {
    const withdraw = await adminService.getAllWithdraw();

    if (!withdraw) {
      return res.status(404).json({
        error: true,
        message: 'No withdraw found',
        data: null,
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Withdraw found',
      data: withdraw,
    });
  }
}

export default new adminController();
