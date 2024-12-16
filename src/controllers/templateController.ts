import { Request, Response } from 'express';
import { addTemplateDTO } from '../dtos/shop/addTemplateMassageDTO';

class templateController {
  async getTemplateMassage(req: Request, res: Response) {}
  async createTemplates(req: Request, res: Response) {
    const body: addTemplateDTO = req.body;
  }
  async updateTemplates(req: Request, res: Response) {}
  async deleteTemplates(req: Request, res: Response) {}
}

export default new templateController();
