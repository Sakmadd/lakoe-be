export interface GetOrderByIdDTO {
  id: string;
  total_price: number;
  created_at: Date;
  updated_at: Date;
  OrderItem: OrderItemDTO;
  Payment: PaymentDTO;
  Recipient: Recipient;
}

interface Recipient {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  district: string;
  city: string;
  longitude: string;
  latitude: string;
}

interface OrderItemDTO {
  id: string;
  product_id: string;
  quantity: number;
  Product: ProductDTO;
}

interface ProductDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface PaymentDTO {
  id: string;
  url: string;
}
