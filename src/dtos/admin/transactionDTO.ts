export interface InvoiceDTO {
  id: string;
  recipientId: string;
  prices: number;
  serviceCharge: number;
  invoiceNumber: string;
  courier?: CourierDTO;
  payment?: PaymentDTO;
  recipient: RecipientDTO;
  orderHistory: OrderHistoryDTO[];
}

export interface CourierDTO {
  id: string;
  price: number;
  courierCode: string;
}

export interface PaymentDTO {
  id: string;
  transaction_id: string;
  invoice_id?: string;
  mt_order_id?: string;
  type: string;
  url: string;
  bank?: string;
  amount: number;
  account_name: string;
  account_number: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipientDTO {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  district: string;
  city: string;
  longitude: string;
  latitude: string;
}

export interface OrderHistoryDTO {
  id: string;
  status: string;
  timestamp: Date;
}
