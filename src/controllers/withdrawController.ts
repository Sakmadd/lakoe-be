import { Request, Response } from 'express';
import withdrawService from '../services/withdrawService';
import { CreateWithdrawDTO } from '../dtos/withdraw/createWithdrawDTO';

class withdrawController {
  async getWithdraw(req: Request, res: Response) {
    const withdraw = await withdrawService.getAllWithdraw();

    if (!withdraw) {
      return res.status(404).json({
        error: true,
        message: 'No withdraw found in the database',
        data: null,
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Withdraw found',
      data: withdraw,
    });
  }

  async createWithdraw(req: Request, res: Response) {
    const shop_id = res.locals.user.shop_id;
    const body: CreateWithdrawDTO = req.body;
    const user = await withdrawService.createWithDraw(body, shop_id);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'you cannot access this account',
        data: null,
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Withdraw created successfully',
      data: user,
    });
  }
}

export default new withdrawController();
