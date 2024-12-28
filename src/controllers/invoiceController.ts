import { Request, Response } from 'express';
import ResponseDTO from '../dtos/responseDto';
import invoiceService from '../services/invoiceService';

class invoiceController {
  async postToWa(req: Request, res: Response) {
    const { id } = req.params;

    const { error, message, payload } = await invoiceService.postToWa(id);

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

  async createOrderBiteship(req: Request, res: Response) {
    const { id } = req.params;

    const { error, message, payload } =
      await invoiceService.createOrderBiteship(id);

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

  async getInvoiceDetail(req: Request, res: Response) {
    const { id } = req.params;

    const { error, message, payload } =
      await invoiceService.getInvoiceDetail(id);

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

  async rejectOrder(req: Request, res: Response) {
    const { id } = req.params;

    const { error, message, payload } = await invoiceService.rejectOrder(id);

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

  async getAllInvoiceBySellerId(req: Request, res: Response) {
    const id = res.locals.user.shop_id;

    const { error, message, payload } =
      await invoiceService.getAllInvoiceBySellerId(id);

    console.log(payload);

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
        error: false,
        message: message,
        data: payload,
      }),
    );
  }
}
export default new invoiceController();
