import { PaymentType } from '../../types/types';
import { PaymentDTO } from '../admin/transactionDTO';

export type CreateOrdersDTO = {
  Recipient?: RecipientDTO;
  total_price: number;
  OrderItem: OrderItemType;
  Payment: ResPaymentOrderDTO;
};
interface RecipientDTO {
  name: string;
  email: string;
  address: string;
  phone: string;
  district: string;
  city: string;
  longitude: string;
  latitude: string;
}

interface OrderItemType {
  recipientId: string;
  quantity: number;
  Product?: Product;
}

export interface Product {
  shop_id: string;
  category_id: string;
  name: string;
  sku: string;
  price: number;
  url_name: string;
  description: string;
  stock: number;
  weight: number;
  minimum_order: number;
  is_active: boolean;
  length: number;
  width: number;
  height: number;
}

export interface ResPaymentOrderDTO {
  invoice_id?: string;
  mt_order_id?: string;
  type: string;
  url: string;
  bank?: string;
  amount: number;
  account_name: string;
  account_number: string;
  status: string;
}
