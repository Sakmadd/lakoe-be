import { Request, Response } from 'express';
import { CreateWithdrawDTO } from '../dtos/withdraw/createWithdrawDTO';
import { updateWithdrawDTO } from '../dtos/withdraw/updateWithdrawDTO';
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

  async updateWithdraw(req: Request, res: Response) {
    try {
      const body: updateWithdrawDTO = req.body;
      const { data, error, message } =
        await withdrawService.updateWithDraw(body);

      if (error) {
        return res.status(400).json({
          error: false,
          message: message,
          data: data,
        });
      }

      return res.status(200).json({
        error: false,
        message: 'Withdraw updated successfully',
        data: data,
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
