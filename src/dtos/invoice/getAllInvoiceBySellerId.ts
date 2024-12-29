export interface GetAllInvoiceBySellerId {
  invoice_id: string;
  status: string;
  invoice_number: string;
  phone: string;
  created_at: Date;
  product: ProductsDTO;
  courier: CourierDTO;
}

export interface ProductsDTO {
  name: string;
  image: string;
  quantity: number;
  total_price: number;
}

interface CourierDTO {
  id: string;
  invoice_id: string;
  order_id: string;
  biteship_order_id: string;
  origin_area_id: string;
  price: number;
  courier_company: string;
  courier_code: string;
  courier_type: string;
  tracking_id: string;
  waybill_id: string;
}
