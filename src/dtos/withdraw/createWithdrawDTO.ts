import { withDrawStatus } from '@prisma/client';

export interface CreateWithdrawDTO {
  amount: number;
  reference_no: string;
  status: withDrawStatus;
  notes: string | null;
}
