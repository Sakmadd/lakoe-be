export interface GetAllInvoiceBySellerId {
  invoice_id: string;
  status: string;
  invoice_number: string;
  phone: string;
  created_at: Date;
  product: ProductsDTO;
}

export interface ProductsDTO {
  name: string;
  image: string;
  quantity: number;
  total_price: number;
}
