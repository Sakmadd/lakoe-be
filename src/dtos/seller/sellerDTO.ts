import { OrderStatus } from '@prisma/client';

export interface sellerShopRes {
  balance: number;
  products: number;
  porductUnpaid: number;
}

export interface sellerGraphRes {
  status: String;
}
