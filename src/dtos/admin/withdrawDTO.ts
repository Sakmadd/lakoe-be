export interface WithdrawDTO {
  id: string;
  referenceNo: string;
  amount: number;
  status: string;
  notes: string | null;
  updatedAt: Date;
  createdAt: Date;
  bankAccount: BankAccountDTO;
  shop: ShopDTO;
}

interface BankAccountDTO {
  id: string;
  name: string;
  account: string;
  bank: string;
}

interface ShopDTO {
  id: string;
  balance: number;
  userName: string | null;
}
