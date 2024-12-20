import { Request, Response } from 'express';
import { CreateOrdersDTO } from '../dtos/orders/createOrders';
import orderService from '../services/orderService';
class OrderController {
  async postOrder(req: Request, res: Response) {
    try {
      const data: CreateOrdersDTO = req.body;
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

    const rates = await orderService.shipmentRates(data);
  }
}

export default new OrderController();
