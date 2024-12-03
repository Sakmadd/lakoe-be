import { Request, Response } from 'express';
import shopService from '../services/shopService';

class shopController {
  async getShop(req: Request, res: Response) {
    const { id } = req.params;

    const shop = await shopService.getShopDetail(id);

    if (!shop) {
      return res.status(404).json({
        error: true,
        message: 'No shop found in the database',
        data: null,
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Shop Found',
      data: shop,
    });
  }

  async updateShop(req: Request, res: Response) {
    const { id } = req.params;
    const { name, phone, description, slogan, logo } = req.body;

    const shop = await shopService.updateShop({
      name,
      phone,
      description,
      slogan,
      logo,
      id,
    });
  }
}

export default new shopController();
