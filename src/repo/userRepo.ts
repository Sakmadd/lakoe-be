import { UpdateUserDTO } from '../dtos/user/updateUser';
import { prisma } from '../libs/prisma';
import { UserDetailType, UserType } from '../types/types';

export async function getAllUser() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      shop_id: true,
      Shop: true,
    },
  });

  if (!users) {
    throw new Error('Users not found');
  }

  return users;
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      shop_id: true,
      Shop: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

export async function updateUser(data: UpdateUserDTO) {
  const user = await prisma.user.update({
    where: { id: data.id },
    data: {
      name: data.name,
      email: data.email,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

export async function getLoggedUser(loggedUser: UserType) {
  const rawUser: UserDetailType = await prisma.user.findUnique({
    where: {
      id: loggedUser.id,
    },
    include: {
      Shop: {
        select: {
          id: true,
          balance: true,
          description: true,
          location: true,
          logo: true,
          phone: true,
          slogan: true,
          Withdraw: true,
          Product: {
            select: {
              id: true,
              shop_id: true,
              name: true,
              description: true,
              category_id: true,
              sku: true,
              price: true,
              url_name: true,
              stock: true,
              weight: true,
              minimum_order: true,
              is_active: true,
              length: true,
              width: true,
              height: true,
              created_at: true,
              updated_at: true,
              Images: true,
            },
          },
        },
      },
    },
  });

  delete rawUser.password;
  return rawUser;
}
