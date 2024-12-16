import ServiceResponseDTO from '../dtos/serviceResponseDto';
import { addTemplateDTO } from '../dtos/shop/addTemplateMassageDTO';
import templateRepo from '../repo/templateRepo';
import { TemplateType } from '../types/types';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';

class templateService {
  async createTemplate(
    bodyTemplate: addTemplateDTO,
  ): Promise<ServiceResponseDTO<TemplateType | null>> {
    try {
      const template = await templateRepo.createTemplate(bodyTemplate);
      return new ServiceResponseDTO<TemplateType>({
        error: false,
        message: null,
        payload: template,
      });
    } catch (error) {
      return serviceErrorHandler<TemplateType | null>({
        error: true,
        message: error.message,
        payload: null,
      });
    }
  }

  async updateTemplate(
    id: string,
    bodyTemplate: addTemplateDTO,
  ): Promise<ServiceResponseDTO<TemplateType | null>> {
    try {
      const updateTemplate = await templateRepo.updateTemplate(
        id,
        bodyTemplate,
      );
      return new ServiceResponseDTO<TemplateType>({
        error: false,
        message: null,
        payload: updateTemplate,
      });
    } catch (error) {
      return serviceErrorHandler<TemplateType | null>({
        error: true,
        message: error.message,
        payload: null,
      });
    }
  }

  async deleteTemplate(
    id: string,
  ): Promise<ServiceResponseDTO<TemplateType | null>> {
    try {
      await templateRepo.deleteTemplate(id);
      return new ServiceResponseDTO<TemplateType>({
        error: false,
        message: null,
        payload: null,
      });
    } catch (error) {
      return serviceErrorHandler<TemplateType | null>({
        error: true,
        message: error.message,
        payload: null,
      });
    }
  }

  async getTemplateMassage() {
    try {
      const template = await templateRepo.getTemplateMassage();
      return {
        error: false,
        message: null,
        payload: template,
      };
    } catch (error) {
      return {
        error: true,
        message: error.message,
        payload: null,
      };
    }
  }
}

export default new templateService();
