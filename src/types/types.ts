import { OrderStatus, Role } from '@prisma/client';

export interface CategoryWithChildren {
  id: string;
  label: string;
  value: string;
  parent_id?: string;
  children: CategoryWithChildren[];
}

export interface UserType {
  id: string;
  shop_id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
}

export interface TemplateType {
  id: string;
  title: string;
  contain_message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDetailType extends UserType {
  Shop: ShopType;
}

export interface ShopType {
  id: string;
  name?: string;
  phone?: string;
  description?: string;
  slogan?: string;
  logo?: string;
  balance: number;
  Location?: LocationType[];
  Product?: ProductType[];
  Withdraw?: WithdrawType[];
  User?: UserType;
}

export interface LocationType {
  id: string;
  shop_id: string;
  name: string;
  province: string;
  city: string;
  district: string;
  subdistrict: string;
  address: string;
  postal_code: string;
  longitude: string;
  latitude: string;
  is_main: boolean;

  Shop?: ShopType;
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
  Images?: ImageType[];
  VariantOptionCombination?: VariantOptionCombinationType[];
}

export interface ImageType {
  id: string;
  product_id: string;
  alt?: string;
  src: string;
  Product?: ProductType;
}

export interface CategoryType {
  id: string;
  label: string;
  value: string;
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
  variantId?: string;
  src?: string;
  alt?: string;
  Variant?: VariantType;
}

export interface VariantOptionCombinationType {
  id: string;
  name: string;
  is_active: boolean;
  price: number;
  weight: number;
  sku: string;
  stock: number;
  product_id: string;
  Product?: ProductType;
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
  OrderHistory?: OrderHistoryType[];
}

export interface OrderHistoryType {
  id: string;
  invoice_id: string;
  status: OrderStatus;
  timestamp: Date;
  Invoice?: InvoicesType;
}

export interface CourierType {
  id: string;
  invoice_id: string;
  price: number;
  courierCode: string;
  Invoices?: InvoicesType;
}

export interface OrderType {
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
  Order?: OrderType;
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
  longitude: string;
  latitude: string;
  Order?: OrderType;
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
  Order?: OrderType;
  Invoice?: InvoicesType;
}

export interface BankAccountType {
  id: string;
  name: string;
  account: string;
  bank: string;
}

export interface WithdrawType {
  id: string;
  bank_account_id: string;
  shop_id: string;
  reference_no: string;
  amount: number;
  notes?: string;
  status: string;
  updated_at: Date;
  created_at: Date;
  BankAccount?: BankAccountType;
  Shop?: ShopType;
}

export interface BalanceType {
  amount: number;
}
