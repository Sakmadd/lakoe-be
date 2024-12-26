export interface CreateOrderBiteshipResponseDTO {
  biteship_order_id: string;
  id: string;
  recipient_id: string;
  shop_id: string;
  price: number;
  service_charge: number;
  Courier?: CourierDTO;
  Payment?: PaymentDTO;
  Recipient?: RecipientDTO;
}

interface CourierDTO {
  id: string;
  origin_area_id: string;
  destination_area_id: string;
  price: number;
  courier_company: string;
  courier_code: string;
  courier_type: string;
  tracking_id?: string;
  waybill_id?: string;
}

interface PaymentDTO {
  id: string;
  type: string;
  url: string;
  bank?: string;
  amount: number;
  account_name: string;
  account_number: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

interface RecipientDTO {
  id: string;
  name: string;
  phone: string;
  address: string;
}
