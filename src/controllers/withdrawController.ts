import { Request, Response } from 'express';
import withdrawService from '../services/withdrawService';
import ResponseDTO from '../dtos/responseDto';

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
    const { amount } = req.body;
    const id = res.locals.user.id;

    const withdraw = await withdrawService.createWithdraw(amount, id);

    if (!withdraw) {
      return res.status(404).json({
        error: true,
        message: 'Withdraw Request failed. Please try again',
        data: null,
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Withdraw created',
      data: withdraw,
    });
  }

  async getAllWithdrawSeller(req: Request, res: Response) {
    const { id } = res.locals.user.shop_id;

    const { error, message, payload } =
      await withdrawService.getAllWithdrawSeller(id);

    if (error) {
      return res.status(404).json(
        new ResponseDTO({
          error: error,
          message: message,
          data: null,
        }),
      );
    }

    return res.status(200).json(
      new ResponseDTO({
        error: error,
        message: message,
        data: payload,
      }),
    );
  }
}

export default new withdrawController();
