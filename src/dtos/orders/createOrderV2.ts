import { GetOrderByIdDTO } from './getOrderByID';

export interface CreateOrderRequestDTO {
  name: string;
  email: string;
  phone: string;
  address: string;
  province: string;
  city: string;
  district: string;
  subdistrict: string;
  postal_code: string;
  longitude: string;
  latitude: string;
  origin_area_id: string;
  destination_area_id: string;
  courier_price: number;
  courier_company: string;
  courier_code: string;
  courier_type: string;
  items: ProductDTO;
}

interface ProductDTO {
  product_id: string;
  variant_combination_id?: string;
  price: number;
  quantity: number;
}

export interface CreateOrderResponseDTO {
  token: string;
  redirect_url;
  order: GetOrderByIdDTO;
}

// export interface CreateOrderResponse {
//     id: string;
//     recipient_id: string;
//     total_price: number;
//     created_at: Date;
//     updated_at: Date;
//     Recipient?: RecipientDTO;
//     OrderItem?: OrderItem;
//     Payment?: PaymentDTO;
//     Courier?: CourierDTO;
// }

// interface RecipientDTO {
//     id: string;
//     name: string;
//     email: string;
//     phone: string;
//     address: string;
//     province: string;
//     city: string;
//     district: string;
//     subdistrict: string;
//     postal_code: string;
//     longitude: string;
//     latitude: string;
// }

// interface OrderItem {
//     id: string;
//     order_id: string;
//     variant_combination_id: string;
//     price: number;
//     quantity: number;
// }

// interface PaymentDTO {
//     id: string;
//     url: string;
//     amount: number;
//     order_id: string;
// }

// interface CourierDTO {
//     id: string;
//     order_id: string;
//     origin_area_id: string;
//     destination_area_id: string;
//     price: number;
//     courier_company: string;
//     courier_code: string;
//     courrier_type: string;
// }
