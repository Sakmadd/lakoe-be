import { Request, Response } from 'express';
import { addTemplateDTO } from '../dtos/shop/addTemplateMassageDTO';
import templateService from '../services/templateService';
import { string } from 'zod';

class templateController {
  async getTemplateMassage(req: Request, res: Response) {
    const template = await templateService.getTemplateMassage();

    if (!template) {
      return res.status(404).json({
        error: true,
        message: 'Template not found',
        data: null,
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Template Found',
      data: template,
    });
  }
  async createTemplates(req: Request, res: Response) {
    const bodyTemplate: addTemplateDTO = req.body;

    const template = await templateService.createTemplate(bodyTemplate);

    if (!bodyTemplate) {
      return res.status(404).json({
        error: true,
        message: 'No shop found in the database',
        data: null,
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Shop Found',
      data: template,
    });
  }
  async updateTemplates(req: Request, res: Response) {
    const { id } = req.params;
    const bodyTemplate: addTemplateDTO = req.body;

    const template = await templateService.updateTemplate(id, bodyTemplate);

    if (!template) {
      return res.status(404).json({
        error: true,
        message: 'cannot update template message',
        data: null,
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Template Message Updated',
      data: template,
    });
  }
  async deleteTemplates(req: Request, res: Response) {
    const { id } = req.params;

    const template = await templateService.deleteTemplate(id);

    if (!template) {
      return res.status(404).json({
        error: true,
        message: 'cannot delete template message',
        data: null,
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Template Message Has been deleted',
      data: template,
    });
  }
}

export default new templateController();
