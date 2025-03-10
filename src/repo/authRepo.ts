import { prisma } from '../libs/prisma';
import RegisterDto from '../dtos/authentication/registerDto';
import hasher from '../utils/hasher';
import LoginDTO from '../dtos/authentication/loginDTO';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';

export async function registerRepo(data: RegisterDto) {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ name: data.name }, { email: data.email }],
    },
    select: {
      name: true,
      email: true,
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

export async function loginRepo(data: LoginDTO) {
  const requestedUser = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  });

  if (!requestedUser) {
    throw new Error('User not found');
  }

  const compare = hasher.comparePassword(data.password, requestedUser.password);

  if (!compare) {
    throw new Error('Wrong email or password');
  }
  delete requestedUser.password;

  return requestedUser;
}
