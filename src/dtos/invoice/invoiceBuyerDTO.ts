import { OrderStatus } from '@prisma/client';

export interface InvoiceBuyerDTO {
  id: string;
  price: number;
  invoice_number;
  created_at: Date;
  Courier: CourierDTO;
  Payment: PaymentDTO;
  Recipient: RecipientDTO;
  Shop: ShopDTO;
  Product: ProductDTO;
  Price: PriceDTO;
  OrderHistory: OrderHistoryDTO[];
}

interface CourierDTO {
  courier_company: string;
  courier_code: string;
  tracking_id?: string;
  waybill_id?: string;
}

interface PaymentDTO {
  url: string;
}

interface RecipientDTO {
  name: string;
  address: string;
  phone: string;
}

interface ShopDTO {
  name: string;
  logo: string;
  slogan: string;
}

interface OrderHistoryDTO {
  status: OrderStatus;
  timestamp: Date;
}

export interface ProductDTO {
  name: string;
  image: string;
  price: number;
  quantity: number;
  total_price: number;
}

interface PriceDTO {
  total_price: number;
  shipping_cost: number;
  discount: number;
  service_fee: number;
  total: number;
}
