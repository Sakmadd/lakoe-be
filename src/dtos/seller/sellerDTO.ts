import { OrderStatus } from '@prisma/client';

export interface sellerShopRes {
  balance: number;
  products: number;
  porductUnpaid: number;
}

export interface sellerGraphRes {
  status: String;
  perMonth: Mounth;
}

interface Mounth {
  January: number;
  February: number;
  March: number;
  April: number;
  May: number;
  June: number;
  July: number;
  September: number;
  October: number;
  November: number;
  December: number;
}

export interface getAllOrder {
  product: String;
  category: String;
  payment: Number;
  recipient: String;
  status: OrderStatus;
  timestamp: Date;
}

export const month = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'September',
  'October',
  'November',
  'December',
];
