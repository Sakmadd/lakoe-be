import { withDrawStatus } from '@prisma/client';

export interface WithdrawDTO {
  amount: number;
  status: withDrawStatus;
  notes: string | null;
  updatedAt: Date;
  createdAt: Date;
  bankAccount: BankAccountDTO;
  shop: ShopDTO;
}

interface BankAccountDTO {
  name: string;
  account: string;
  bank: string;
}

interface ShopDTO {
  id: string;
  balance: number;
  userName: string | null;
}
