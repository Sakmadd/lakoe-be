export interface ProductsDTO {
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
  ProductImages: {
    src: string;
  };
  Shop: {
    name: string;
  };
}
