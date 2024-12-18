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
