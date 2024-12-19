export interface ProductByShopDTO {
  id: string;
  name: string;
  is_active: boolean;
  price: number;
  stock: number;
  sku?: string;
  url_name: string;
  created_at: Date;
  updated_at: Date;
  Images: ImageDTO[];
  Category: CategoryDTO;
}

interface ImageDTO {
  id: string;
  alt?: string;
  src: string;
}

interface CategoryDTO {
  id: string;
  parent_id?: string;
  label: string;
  value: string;
}
