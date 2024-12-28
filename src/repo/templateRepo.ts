import { addTemplateDTO } from '../dtos/shop/addTemplateMassageDTO';
import { assginDTO } from '../dtos/template/assignTemplate';
import { ResTemplateType } from '../dtos/template/restemplate';
import { prisma } from '../libs/prisma';

class templateRepo {
  async createTemplate(bodyTemplate: addTemplateDTO, shop_id: string) {
    const dataContain = {
      title: bodyTemplate.title,
      contain_message: '[product name], [costumer name], [shop name]',
      shop_id,
    };
    const template = await prisma.templateMessage.create({
      data: dataContain,
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

  async getTemplateMassage(shop_id: string) {
    const templates = await prisma.templateMessage.findMany({
      where: { shop_id },
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

  async findData(template_id: string, invoice_id: string) {
    const template = await prisma.templateMessage.findUnique({
      where: { id: template_id },
    });
    const [product, recipient, shop] = await Promise.all([
      prisma.invoices.findUnique({
        where: { id: invoice_id },
        select: {
          Payment: {
            select: {
              Order: {
                select: {
                  OrderItem: {
                    select: {
                      Product: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.invoices.findUnique({
        where: { id: invoice_id },
        select: {
          Recipient: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.invoices.findUnique({
        where: { id: invoice_id },
        select: {
          Shop: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    const response: assginDTO = {
      name_product: product.Payment?.Order?.OrderItem.Product.name,
      name_costumer: recipient.Recipient?.name,
      name_shop: shop.Shop?.name,
    };

    const message = template.contain_message
      .replace(/\[product name\]/g, response.name_product)
      .replace(/\[costumer name\]/g, response.name_costumer)
      .replace(/\[shop name\]/g, response.name_shop);

    const result: ResTemplateType = {
      title: template.title,
      contain_message: message,
    };
    return result;
  }
}

export default new templateRepo();
