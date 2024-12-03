import { OrderStatus } from '@prisma/client';

export interface UserType {
  id: string;
  shop_id: string;
  name: string;
  email: string;
  password?: string;
}

export interface UserDetailType extends UserType {
  Shop: ShopType;
}

export interface ShopType {
  id: string;
  phone?: string;
  description?: string;
  slogan?: string;
  logo?: string;
  balance: number;
  location?: LocationType[];
  product?: ProductType[];
  user?: UserType;
}

export interface LocationType {
  id: string;
  name: string;
  address: string;
  city: string;
  district: string;
  postal_code: string;
  longitude: string;
  latitude: string;
}

export interface ProductType {
  id: string;
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
  created_at: Date;
  updated_at: Date;
  OrderItem?: OrderItemType[];
  Shop?: ShopType;
  Category?: CategoryType;
  Variant?: VariantType[];
  ProductImages?: ProductImagesType[];
}

export interface ProductImagesType {
  id: string;
  product_id: string;
  alt: string;
  url: string;
  product?: ProductType;
}

export interface CategoryType {
  id: string;
  name: string;
  parent_id?: string;
  Parent?: CategoryType;
  Children?: CategoryType[];
  Product?: ProductType[];
}

export interface VariantType {
  id: string;
  name: string;
  is_active: boolean;
  product_id: string;
  created_at: Date;
  updated_at: Date;
  Product?: ProductType;
  VariantOption?: VariantOptionType[];
}

export interface VariantOptionType {
  id: string;
  name: string;
  variant_id: string;
  created_at: Date;
  updated_at: Date;
  Variant?: VariantType;
  VariantOptionValue?: VariantOptionValueType[];
}

export interface VariantOptionValueType {
  id: string;
  variant_option_id: string;
  name: string;
  sku: string;
  weight: string;
  stock: number;
  price: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  VariantOption?: VariantOptionType;
}

export interface InvoicesType {
  id: string;
  recipient_id: string;
  prices: number;
  serviceCharge: number;
  status: OrderStatus;
  invoiceNumber: string;
  Courier?: CourierType;
  Payment?: PaymentType;
  Recipient?: RecipientType;
}

export interface CourierType {
  id: string;
  invoice_id: string;
  price: number;
  courierCode: string;
  Invoices?: InvoicesType;
}

export interface Order {
  id: string;
  recipient_id: string;
  total_price: number;
  created_at: Date;
  updated_at: Date;
  OrderItem?: OrderItemType[];
  Payment?: PaymentType;
  Recipient?: RecipientType;
}

export interface OrderItemType {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  Order?: Order;
  Product?: ProductType;
}

export interface RecipientType {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  district: string;
  city: string;
  longitude: number;
  latitude: number;
  Order?: Order;
  Invoices?: InvoicesType;
}

export interface PaymentType {
  id: string;
  order_id: string;
  invoice_id: string;
  transaction_id: string;
  type: string;
  url: string;
  bank?: string;
  amount: number;
  account_name: string;
  account_number: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  Order?: Order;
  Invoice?: InvoicesType;
}

export interface BankAccount {
  id: string;
  name: string;
  account: string;
  bank: string;
  Withdraw?: Withdraw[];
}

export interface Withdraw {
  id: string;
  bank_account_id: string;
  shop_id: string;
  reference_no: string;
  amount: number;
  notes?: string;
  status: string;
  updated_at: Date;
  created_at: Date;
  BankAccount?: BankAccount;
  Shop?: ShopType;
}
