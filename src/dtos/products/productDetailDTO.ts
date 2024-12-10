export interface ProductDetailDTO {
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
  Category: CategoryDTO;
  Images: ImageDTO[];
  Variant: VariantDTO[];
  Shop: ShopDTO;
  VariantOptionCombinations: VariantOptionCombinationDTO[];
}

interface CategoryDTO {
  id: string;
  parent_id?: string;
  label: string;
  value: string;
}

interface ImageDTO {
  id: string;
  product_id: string;
  alt?: string;
  src: string;
}

interface VariantDTO {
  id: string;
  name: string;
  is_active: boolean;
  product_id: string;
  VariantOption: VariantOptionDTO[];
}

interface VariantOptionDTO {
  id: string;
  variant_id: string;
  name: string;
  src?: string;
  alt?: string;
}

interface ShopDTO {
  id: string;
  description: string;
  slogan: string;
  phone: string;
  logo: string;
  User: UserDTO;
}

interface UserDTO {
  name: string;
}

interface VariantOptionCombinationDTO {
  id: string;
  product_id: string;
  name: string;
  is_active: boolean;
  price: number;
  stock: number;
  weight: number;
  sku: string;
}
