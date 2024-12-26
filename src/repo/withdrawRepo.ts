import { withDrawStatus } from '@prisma/client';
import { CreateWithdrawDTO } from '../dtos/withdraw/createWithdrawDTO';
import {
  updateWithdrawDTO,
  updateWithDrawID,
} from '../dtos/withdraw/updateWithdrawDTO';
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
          User: {
            select: {
              name: true,
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
      User: {
        name: withdraw.Shop.User.name,
      },
    },
  }));

  return response;
}
export async function createWithdraw(body: CreateWithdrawDTO, shopId: string) {
  const withdraw = await prisma.withdraw.create({
    data: {
      amount: body.amount,
      status: withDrawStatus.pending,
      notes: body.notes || '',
      created_at: new Date(),
      updated_at: new Date(),
      Shop: {
        connect: { id: shopId },
      },
      BankAccount: {
        connect: { shop_id: shopId },
      },
    },
    include: {
      Shop: true,
      BankAccount: true,
    },
  });
  return withdraw;
}

export async function updateWithdraw(
  { shop_id, id }: updateWithDrawID,
  body: updateWithdrawDTO,
) {
  try {
    const withdraw = await prisma.withdraw.update({
      where: {
        id,
        shop_id,
      },
      data: {
        status: body.status,
        notes: body.notes || '',
      },
    });
    console.log('1');

    switch (withdraw.status) {
      case withDrawStatus.rejected:
        return {
          error: true,
          message: 'Withdraw rejected',
          data: null,
        };

      case withDrawStatus.accepted:
        await handleAcceptedWithdraw(shop_id, id);
        return {
          error: false,
          message: 'Withdraw accepted',
          data: null,
        };
      case withDrawStatus.pending:
        return {
          error: false,
          message: 'Withdraw pending',
          data: null,
        };
      default:
        return {
          error: true,
          message: 'Invalid withdraw status',
          data: null,
        };
    }
  } catch (error) {
    console.error('Error updating withdraw:', error);
    return {
      error: true,
      message: 'An error occurred while processing withdraw',
      data: null,
    };
  }
}
async function handleAcceptedWithdraw(shop_id: string, id: string) {
  const shop = await prisma.shop.findUnique({
    where: { id: shop_id },
    select: { balance: true },
  });

  const withdraw = await prisma.withdraw.findUnique({
    where: { id, shop_id },
    select: { amount: true },
  });

  if (!shop || !withdraw) {
    throw new Error('Shop or Withdraw not found');
  }

  const updatedBalance = shop.balance - withdraw.amount;

  await prisma.shop.update({
    where: { id: shop_id },
    data: { balance: updatedBalance },
  });
}

export async function getWithdrawById(shop_id: string) {
  const withdraws = await prisma.withdraw.findMany({
    where: {
      shop_id,
    },
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
          User: {
            select: {
              name: true,
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
      User: {
        name: withdraw.Shop.User.name,
      },
    },
  }));
  return response;
}
