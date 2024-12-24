import { Request, Response } from 'express';
import selerService from '../services/sellerService';

class sellerController {
  async getDashboard(req: Request, res: Response) {
    const shop_id = res.locals.user.shop_id;

    if (!shop_id) {
      return res.status(404).json({
        error: true,
        message: 'you cannot accsess this dashboard',
        data: null,
      });
    }
    const result = await selerService.getDashboard(shop_id);
    if (!result) {
      return res.status(404).json({
        error: true,
        message: 'No data found in the database',
        data: null,
      });
    }
    return res.status(200).json({
      error: false,
      message: 'data found',
      data: result,
    });
  }

  async getGraph(req: Request, res: Response) {
    const shop_id = res.locals.user.shop_id;

    if (!shop_id) {
      return res.status(404).json({
        error: true,
        message: 'you cannot accsess this dashboard',
        data: null,
      });
    }
    const result = await selerService.getGraph(shop_id);
    if (!result) {
      return res.status(404).json({
        error: true,
        message: 'No data found in the database',
        data: null,
      });
    }
    return res.status(200).json({
      error: false,
      message: 'data found',
      data: result,
    });
  }
  async getAllOrder(req: Request, res: Response) {
    const shop_id = res.locals.user.shop_id;

    if (!shop_id) {
      return res.status(404).json({
        error: true,
        message: 'you cannot accsess this dashboard',
        data: null,
      });
    }
    const result = await selerService.getAllOrder(shop_id);
    if (!result) {
      return res.status(404).json({
        error: true,
        message: 'No data found in the database',
        data: null,
      });
    }
    return res.status(200).json({
      error: false,
      message: 'data found',
      data: result,
    });
  }

  // async getOrderByIdOrder (req: Request, res:Response) {
  //   const shop_id = res.locals.user.shop_id;
  //   const { id } = req.params;
  //   if (!shop_id) {
  //     throw new Error(' you cannot allowed to this order')
  //   }
  //   const result = await selerService.getOrderByIdOrder(id);
  //   // let result : any

  //   if (!result) {
  //   return {
  //     error: false,
  //     message: 'data found',
  //     data: result,
  //   }
  // }
  // else{
  //   return {
  //     error: true,
  //     message: 'No data found in the database',
  //     data: null,
  //   }
  // }
  // }
}
export default new sellerController();
