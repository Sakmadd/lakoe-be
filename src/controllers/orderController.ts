import { Request, Response } from 'express';
import { CreateOrdersDTO } from '../dtos/orders/createOrders';
import orderService from '../services/orderService';
import ResponseDTO from '../dtos/responseDto';
import { CreateOrderRequestDTO } from '../dtos/orders/createOrderV2';
class OrderController {
  async postOrder(req: Request, res: Response) {
    try {
      const data: CreateOrderRequestDTO = req.body;

      const order = await orderService.createOrder(data);
      res.status(200).json({
        error: false,
        massage: 'Orders retrieved successfully',
        data: order,
      });
    } catch {
      res.status(400).send({
        error: true,
        massage: 'Error retrieving orders',
        data: null,
      });
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
