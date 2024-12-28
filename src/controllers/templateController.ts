import { Request, Response } from 'express';
import { addTemplateDTO } from '../dtos/shop/addTemplateMassageDTO';
import templateService from '../services/templateService';
import { assginDTO } from '../dtos/template/assignTemplate';

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
    const shop_id = res.locals.user.shop_id;
    const template = await templateService.createTemplate(
      bodyTemplate,
      shop_id,
    );

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
  async assignTemplates(req: Request, res: Response) {
    const template_id = req.query.template_id as string;
    const invoice_id = req.query.invoice_id as string;
    const template = await templateService.assignTemplates(
      template_id,
      invoice_id,
    );

    if (!template) {
      return {
        error: true,
        message: 'cannot assign templates',
        data: null,
      };
    }
    return res.status(200).json({
      error: false,
      message: 'assgin has been successfully assigned templates',
      data: template,
    });
  }
}

export default new templateController();
