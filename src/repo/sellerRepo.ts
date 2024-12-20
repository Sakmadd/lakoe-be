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
            Payment: {
              Order: {
                OrderItem: {
                  is: {
                    Product: {
                      shop_id,
                    },
                  },
                },
              },
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
          Payment: {
            Order: {
              OrderItem: {
                is: {
                  Product: {
                    shop_id,
                  },
                },
              },
            },
          },
        },
      },
    });
    return graph;
  }
}
export default new sellerRepo();
