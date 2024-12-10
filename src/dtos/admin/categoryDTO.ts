export interface ImageDTO {
  id: string;
  alt: string | null;
  src: string;
}

export interface ProductDTO {
  id: string;
  name: string;
  urlName: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  productImages: ImageDTO[];
}

export interface CategoryDTO {
  id: string;
  label: string;
  value: string;
  parentId: string | null;
  products: ProductDTO[];
}
