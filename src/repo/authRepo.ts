import { PrismaClient } from '@prisma/client';
import RegisterDto from '../dtos/registerDto';
import hasher from '../utils/hasher';

const prisma = new PrismaClient();

export async function registerRepo(data: RegisterDto) {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ name: data.name }, { email: data.email }],
    },
  });

  if (existingUser) {
    if (existingUser.name === data.name) {
      throw new Error('Username already exists');
    }
    if (existingUser.email === data.email) {
      throw new Error('Email already exists');
    }
  }

  const shop = await prisma.shop.create({ data: { balance: 0 } });

  const user = await prisma.user.create({
    data: {
      shop_id: shop.id,
      email: data.email,
      name: data.name,
      password: await hasher.hashPassword(data.password),
    },
  });
  delete user.password;

  return user;
}
