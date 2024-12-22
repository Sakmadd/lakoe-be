import { Request, Response } from 'express';
import { CreateOrdersDTO } from '../dtos/orders/createOrders';
import orderService from '../services/orderService';
import ResponseDTO from '../dtos/responseDto';
import { CreateOrderRequestDTO } from '../dtos/orders/createOrderV2';

class OrderController {
  async postOrder(req: Request, res: Response) {
    try {
      const data: CreateOrderRequestDTO = req.body;

      const { error, message, payload } = await orderService.createOrder(data);

      if (error) {
        // Return here to prevent further execution
        return res.status(400).json(
          new ResponseDTO({
            error: error,
            message: message,
            data: null,
          }),
        );
      }

      // This will execute only if there's no error
      res.status(200).json(
        new ResponseDTO({
          error: false,
          message: message,
          data: payload,
        }),
      );
    } catch (err) {
      // Catch any unexpected errors
      res.status(500).json(
        new ResponseDTO({
          error: true,
          message: 'An unexpected error occurred.',
          data: null,
        }),
      );
    }
  }

  async shipmentRates(req: Request, res: Response) {
    const data = req.body;

    const { error, message, payload } = await orderService.shipmentRates(data);

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

  async createOrder(req: Request, res: Response) {
    const data = req.body;

    data.quantity = +data.quantity;
    data.rates = +data.rates;
    data.price = +data.price;

    const { error, message, payload } = await orderService.createOrder(data);

    if (error) {
      return res.status(400).json(
        new ResponseDTO({
          error: error,
          message: message,
          data: payload,
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

export default new OrderController();
