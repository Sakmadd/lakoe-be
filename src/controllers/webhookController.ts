import { Request, Response } from 'express';
import { MidtransDTO } from '../dtos/webhook/midtrans';
import ResponseDTO from '../dtos/responseDto';
import webhookService from '../services/webhookService';

class webhookController {
  async postMidtrans(req: Request, res: Response) {
    try {
      const { transaction_status, fraud_status, order_id } = req.body;

      if (!req.body || !order_id) {
        return res.status(400).json(
          new ResponseDTO({
            error: true,
            message: 'No notification or invalid order ID',
            data: null,
          }),
        );
      }

      const { error, message, payload } = await webhookService.postMidtrans({
        transaction_status,
        fraud_status,
        order_id,
      });

      if (error) {
        return res.status(400).json(
          new ResponseDTO({
            error: true,
            message: message,
            data: null,
          }),
        );
      }

      return res.status(200).json(
        new ResponseDTO({
          error: false,
          message: message,
          data: payload,
        }),
      );
    } catch (err) {
      console.error('Error in postMidtrans:', err);
      return res.status(500).json(
        new ResponseDTO({
          error: true,
          message: 'Internal server error',
          data: null,
        }),
      );
    }
  }

  async biteshipStatus(req: Request, res: Response) {
    const { order_id, status } = req.body;

    const { error, message, payload } = await webhookService.biteshipStatus({
      order_id,
      status,
    });

    if (error) {
      return res.status(400).json(
        new ResponseDTO({
          error: true,
          message: message,
          data: null,
        }),
      );
    }

    return res.status(200).json(
      new ResponseDTO({
        error: false,
        message: message,
        data: payload,
      }),
    );
  }
}

export default new webhookController();
