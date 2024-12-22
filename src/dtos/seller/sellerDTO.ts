import { OrderStatus } from '@prisma/client';
import {
  OrderHistoryType,
  OrderItemType,
  PaymentType,
  RecipientType,
} from '../../types/types';
import { CategoriesDTO } from '../products/categoriesDTO';

export interface sellerShopRes {
  balance: number;
  products: number;
  porductUnpaid: number;
}

export interface sellerGraphRes {
  status: String;
}

export interface getAllOrder {
  product: String;
  category: String;
  payment: Number;
  recipient: String;
  status: OrderStatus;
  timestamp: Date;
}
