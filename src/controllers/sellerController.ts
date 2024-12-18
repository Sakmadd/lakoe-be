import { Request, Response } from 'express';
import dashboardService from '../services/sellerService';

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
    const result = await dashboardService.getDashboard(shop_id);
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
}
export default new sellerController();
