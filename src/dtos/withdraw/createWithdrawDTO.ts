export interface CreateWithdrawDTO {
  id: string;
  amount: number;
  reference_no: string;
  status: string;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}
