import { withDrawStatus } from '@prisma/client';

export interface CreateWithdrawDTO {
  amount: number;
  reference_no: string;
  status: string;
  notes: string | null;
}
