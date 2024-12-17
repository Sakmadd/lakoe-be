import { addTemplateDTO } from '../dtos/shop/addTemplateMassageDTO';
import { prisma } from '../libs/prisma';

class templateRepo {
  async createTemplate(bodyTemplate: addTemplateDTO) {
    const template = await prisma.templateMessage.create({
      data: {
        title: bodyTemplate.title,
        contain_message: bodyTemplate.contain_message,
      },
    });
    if (!template) {
      throw new Error('Template not found');
    }
    return template;
  }

  async updateTemplate(id: string, bodyTemplate: addTemplateDTO) {
    const template = await prisma.templateMessage.update({
      where: { id },
      data: {
        title: bodyTemplate.title,
        contain_message: bodyTemplate.contain_message,
      },
    });
    if (!template) {
      throw new Error('Template not found');
    }
    return template;
  }

  async deleteTemplate(id: string) {
    const deleteTemplate = await prisma.templateMessage.delete({
      where: { id },
    });
    return deleteTemplate;
  }

  async getTemplateMassage() {
    const templates = await prisma.templateMessage.findMany({
      select: {
        id: true,
        title: true,
        contain_message: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!templates) {
      throw new Error(' templates not found');
    }
    return templates;
  }
}
export default new templateRepo();
