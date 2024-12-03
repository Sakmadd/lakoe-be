import { ShopUpdateDTO } from '../dtos/shop/shopUpdateDTO';
import { prisma } from '../libs/prisma';

export async function getShopDetail(id: string) {
  const shop = await prisma.shop.findUnique({
    where: { id },
    select: {
      id: true,
      phone: true,
      description: true,
      slogan: true,
      logo: true,
      balance: true,
      location: true,
      Product: true,
      User: true,
    },
  });

  if (!shop) {
    throw new Error('Shop not found');
  }

  return shop;
}

export async function updateShop(data: ShopUpdateDTO) {
  const shop = await prisma.shop.update({
    where: { id: data.id },
    data: {
      phone: data.phone,
      description: data.description,
      slogan: data.slogan,
      logo: data.logo,
      User: {
        update: {
          name: data.user.name,
        },
      },
    },
  });

  if (!shop) {
    throw new Error('Shop not found');
  }

  return shop;
}
