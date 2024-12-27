import e from 'express';
import { addTemplateDTO } from '../dtos/shop/addTemplateMassageDTO';
import { prisma } from '../libs/prisma';

class templateRepo {
  async createTemplate(bodyTemplate: addTemplateDTO, shop_id: string) {
    const template = await prisma.templateMessage.create({
      data: {
        title: bodyTemplate.title,
        contain_message: bodyTemplate.contain_message,
        shop: {
          connect: { id: shop_id },
        },
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

  async findData(invo_id: string) {
    if (!invo_id) {
      throw new Error('id invoice tidak di temukan');
    }
    const findData = await prisma.invoices.findUnique({
      where: { id: invo_id },
      select: {
        Shop: {
          select: {
            name: true,
          },
        },
        Recipient: {
          select: {
            name: true,
          },
        },
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
    });
    const formattedData = {
      customer: findData.Recipient?.name || 'Unknown Customer',
      shop: findData.Shop?.name || 'Unknown Shop',
      products: findData.Payment?.Order?.OrderItem || 'Unknown Product',
    };
    return formattedData;
  }

  async assignTemplates(invo_id: string, shop_id: string) {
    try {
      const data = await this.findData(invo_id);
      console.log(data);

      const templates = await prisma.templateMessage.findMany({
        where: {
          shop_id,
        },
      });

      const processedTemplates = templates.map((template) => {
        const newContent = template.contain_message.replace(
          /\[([^\]]+)\]/g,
          (_, key) => {
            const formattedKey = key.trim().toLowerCase().replace(/ /g, '');
            console.log(formattedKey);

            if (formattedKey === 'customername') {
              console.log(data.customer);

              return data.customer;
            }
            if (formattedKey === 'storename') {
              console.log(data.shop);
              return data.shop;
            }
            if (formattedKey === 'productname') {
              console.log(data.products);
              return data.products[0];
            }
            return key;
          },
        );

        return {
          ...template,
          content: newContent,
        };
      });

      return processedTemplates;
    } catch (error) {
      console.error('Error in assignTemplates:', error);
      throw error;
    }
  }
}

export default new templateRepo();
