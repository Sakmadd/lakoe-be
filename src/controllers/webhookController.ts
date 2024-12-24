import { Request, Response } from 'express';
import { MidtransDTO } from '../dtos/webhook/midtrans';
import ResponseDTO from '../dtos/responseDto';
import webhookService from '../services/webhookService';

class webhookController {
  async postMidtrans(req: Request, res: Response) {
    const notificationJSON = JSON.parse(req.body) as MidtransDTO;

    const { error, message, payload } =
      await webhookService.postMidtrans(notificationJSON);

    if (error) {
      return res.status(400).json(
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

export default new webhookController();
