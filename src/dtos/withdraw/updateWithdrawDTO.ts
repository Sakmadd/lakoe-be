import { withDrawStatus } from '@prisma/client';

export interface updateWithdrawDTO {
  status: withDrawStatus;
  notes: string | null;
}

export interface updateWithDrawID {
  shop_id: string;
  id: string;
}

export interface responseWD {
  error: boolean;
  message: string;
  data: any;
}
