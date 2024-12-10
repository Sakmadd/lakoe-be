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
  transactionId: string;
  type: string;
  url: string;
  bank?: string;
  amount: number;
  accountName: string;
  accountNumber: string;
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
