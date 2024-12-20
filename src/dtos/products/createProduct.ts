export interface CreateProductDTO {
  name: string;
  category_id: string;
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
  Variant?: VariantDTO[];
  VariantOptionCombination?: VariantOptionCombinationDTO[];
  Images?: ImagesDTO[];
  Category?: CategoryDTO;
  Shop: ShopDTO;
}

interface CategoryDTO {
  id: string;
  label: string;
  value: string;
}

interface ShopDTO {
  id: string;
  name: string;
}

interface VariantDTO {
  id: string;
  product_id: string;
  name: string;
  is_active: boolean;
  VariantOption: VariantOptionDTO[];
}

interface VariantOptionDTO {
  id: string;
  variant_id: string;
  name: string;
  src?: string;
  alt?: string;
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

interface ImagesDTO {
  id?: string;
  product_id?: string;
  alt?: string;
  src?: string;
}
