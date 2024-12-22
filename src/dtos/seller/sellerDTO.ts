import { OrderStatus } from '@prisma/client';

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
