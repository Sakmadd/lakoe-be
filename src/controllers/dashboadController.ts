import { Request, Response } from 'express';

class dashboardController {
  async getDashboard(req: Request, res: Response) {
    try {
      const { product } = req.query;
    } catch (error) {}
  }
}
export default new dashboardController();
