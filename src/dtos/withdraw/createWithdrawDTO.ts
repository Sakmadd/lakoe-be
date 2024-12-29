import { withDrawStatus } from '@prisma/client';

export interface CreateWithdrawDTO {
  amount: number;
  notes?: string;
}
