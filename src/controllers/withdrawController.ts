import { Request, Response } from 'express';
import { CreateWithdrawDTO } from '../dtos/withdraw/createWithdrawDTO';
import { updateWithdrawDTO } from '../dtos/withdraw/updateWithdrawDTO';
import withdrawService from '../services/withdrawService';

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

  async checkWithdraw(req: Request, res: Response) {
    try {
      const shop_id = res.locals.user.shop_id;
      const { id } = req.params;

      const body: updateWithdrawDTO = req.body;
      const update = await withdrawService.updateWithDraw(
        { shop_id, id },
        body,
      );

      return res.status(200).json({
        error: false,
        message: 'Withdraw updated successfully',
        data: update,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async getWithdrawById(req: Request, res: Response) {
    const shop_id = res.locals.user.shop_id;
    const withdraw = await withdrawService.getWithdrawById(shop_id);

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
}

export default new withdrawController();
