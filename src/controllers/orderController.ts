import { Request, Response } from 'express';
import { CreateOrdersDTO } from '../dtos/orders/createOrders';
import orderService from '../services/orderService';
class OrderController {
  async postOrder(req: Request, res: Response) {
    try {
      const data: CreateOrdersDTO = req.body;
      console.log(data);

      const order = await orderService.createOrder(data);

      console.log(order);

      res.status(200).send({
        error: false,
        massage: 'Orders retrieved successfully',
        data: order,
      });
    } catch (error) {
      res.status(400).send({
        error: true,
        massage: 'Error retrieving orders',
        data: null,
      });
    }
  }
}

export default new OrderController();
