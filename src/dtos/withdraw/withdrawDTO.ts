export interface WithdrawDTO {
  id: string;
  reference_no: string;
  amount: number;
  status: string;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
  bank_account_id: string;
  Shop: ShopDTO;
}

interface ShopDTO {
  id: string;
  User: UserDTO;
}

interface UserDTO {
  email: string;
}
