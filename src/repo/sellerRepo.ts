import { prisma } from '../libs/prisma';

class sellerRepo {
  // async getDashboard(shop_id: string){

  //   const product = await prisma.product.findMany(
  //     {
  //       where:{
  //         shop_id
  //       }
  //     }
  //   )
  //   let products = product.length
  //   const shop = await prisma.shop.findUnique({
  //     where:{
  //       id: shop_id
  //     },
  //     select:{
  //       balance:true,

  //     },

  //   })
  //   const dashboard = {
  //     products,
  //     balance: shop.balance
  //   }

  //   return dashboard;
  // }
  async getDashboard(shop_id: string) {
    const [shopData, productCount] = await Promise.all([
      prisma.shop.findUnique({
        where: { id: shop_id },
        select: { balance: true },
      }),
      prisma.product.count({
        where: { shop_id },
      }),
    ]);

    if (!shopData) {
      throw new Error('Shop not found');
    }

    // Strukturkan data hasil
    return {
      products: productCount,
      balance: shopData.balance,
    };
  }
}
export default new sellerRepo();
