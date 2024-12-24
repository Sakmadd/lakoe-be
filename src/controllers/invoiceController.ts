import { Request, Response } from 'express';
import ResponseDTO from '../dtos/responseDto';
import invoiceService from '../services/invoiceService';

class invoiceController {
  async createInvoice(req: Request, res: Response) {
    const { id } = req.params;

    const { error, message, payload } = await invoiceService.createInvoice(id);

    if (error) {
      return res.status(404).json(
        new ResponseDTO({
          error: true,
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

export default new invoiceController();
