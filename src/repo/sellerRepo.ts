import { GetAllWithdrawSellerDTO } from '../dtos/seller/getAllWithdrawSellerDTO';
import { prisma } from '../libs/prisma';

class sellerRepo {
  async getDashboard(shop_id: string) {
    const [shopData, productCount, productUnpaid] = await Promise.all([
      prisma.shop.findUnique({
        where: { id: shop_id },
        select: { balance: true },
      }),
      prisma.product.count({
        where: { shop_id },
      }),
      prisma.orderHistory.count({
        where: {
          status: 'unpaid',
          Invoice: {
            is: {
              shop_id,
            },
          },
        },
      }),
    ]);

    if (!shopData) {
      throw new Error('Shop not found');
    }

    return {
      products: productCount,
      balance: shopData.balance,
      porductUnpaid: productUnpaid,
    };
  }

  async getGraph(shop_id: string) {
    const graph = await prisma.orderHistory.findMany({
      where: {
        status: 'done',
        Invoice: {
          is: {
            shop_id,
          },
        },
      },
    });
    return graph;
  }
  async getAllOrder(shop_id: string) {
    const [products, order] = await Promise.all([
      prisma.product.findMany({
        where: { shop_id },
        include: {
          OrderItem: {
            select: {
              Product: true,
            },
          },
          Category: {
            select: {
              value: true,
            },
          },
        },
      }),
      prisma.invoices.findMany({
        where: {
          shop_id,
        },
        include: {
          Payment: {
            select: {
              amount: true,
            },
          },
          Recipient: {
            select: {
              name: true,
            },
          },
          OrderHistory: {
            select: {
              status: true,
              timestamp: true,
            },
          },
        },
      }),
    ]);
    if (!products && !order) {
      throw new Error('data not found');
    }
    const result = order.map((order) => {
      const relatedProduct = products.find((product) =>
        product.OrderItem.some((item) => item.Product.id === order.id),
      );

      return {
        product: relatedProduct?.name || '',
        category: relatedProduct?.Category?.value || '',
        payment: order.Payment?.amount || 0,
        recipient: order.Recipient?.name || '',
        status: order.OrderHistory?.[0]?.status,
        timestamp: order.OrderHistory?.[0]?.timestamp || new Date(),
      };
    });
    return result;
  }
}
export default new sellerRepo();
