import { withDrawStatus } from '@prisma/client';
import { GetAllWithdrawSellerDTO } from '../dtos/seller/getAllWithdrawSellerDTO';
import { CreateWithdrawDTO } from '../dtos/withdraw/createWithdrawDTO';
import { updateWithdrawDTO } from '../dtos/withdraw/updateWithdrawDTO';
import { WithdrawDTO } from '../dtos/withdraw/withdrawDTO';
import { prisma } from '../libs/prisma';

export async function getAllWithdraw() {
  const withdraws = await prisma.withdraw.findMany({
    select: {
      id: true,
      reference_no: true,
      amount: true,
      status: true,
      notes: true,
      created_at: true,
      updated_at: true,
      bank_account_id: true,
      Shop: {
        select: {
          id: true,
          name: true,
          User: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  if (!withdraws) {
    throw new Error('No withdrawals found');
  }

  const response: WithdrawDTO[] = withdraws.map((withdraw) => ({
    id: withdraw.id,
    reference_no: withdraw.reference_no,
    amount: withdraw.amount,
    status: withdraw.status,
    notes: withdraw.notes || null,
    created_at: withdraw.created_at,
    updated_at: withdraw.updated_at,
    bank_account_id: withdraw.bank_account_id,
    Shop: {
      id: withdraw.Shop.id,
      name: withdraw.Shop.name,
      User: {
        email: withdraw.Shop.User.email,
      },
    },
  }));

  return response;
}

export async function getAllWithdrawSeller(
  id: string,
): Promise<GetAllWithdrawSellerDTO[]> {
  const shop = await prisma.shop.findMany({
    where: {
      id: id,
    },
    select: {
      id: true,
      Withdraw: true,
    },
  });

  if (!shop) {
    throw new Error('Shop not found');
  }

  if (shop.length === 0) {
    return [];
  }

  const finalResponse: GetAllWithdrawSellerDTO[] = shop[0].Withdraw.map(
    (withdraw) => ({
      id: withdraw.id,
      amount: withdraw.amount,
      status: withdraw.status,
      created_at: withdraw.created_at,
    }),
  );

  return finalResponse;
}
export async function createWithdraw(body: CreateWithdrawDTO, shopId: string) {
  const withdraw = await prisma.withdraw.create({
    data: {
      amount: Number(body.amount),
      status: withDrawStatus.pending,
      notes: body.notes,
      created_at: new Date(),
      updated_at: new Date(),
      Shop: {
        connect: { id: shopId },
      },
      BankAccount: {
        connect: { shop_id: shopId },
      },
    },
  });
  return withdraw;
}

export async function updateWithdraw(body: updateWithdrawDTO) {
  try {
    const withdraw = await prisma.withdraw.update({
      where: {
        id: body.id,
      },
      data: {
        status: body.status,
        notes: body.notes || '',
      },
    });

    return withdraw;
  } catch (error) {
    console.log('Error updating withdraw:', error);
  }
}
export async function handleAcceptedWithdraw(shop_id: string, id: string) {
  const shop = await prisma.shop.findUnique({
    where: { id: shop_id },
  });

  const withdraw = await prisma.withdraw.findUnique({
    where: { id },
  });

  if (!shop || !withdraw) {
    throw new Error('Shop or Withdraw not found');
  }

  const updatedBalance = shop.balance - withdraw.amount;

  const response = await prisma.shop.update({
    where: { id: shop_id },
    data: { balance: updatedBalance },
  });

  return response;
}
