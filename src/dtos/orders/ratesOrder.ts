export interface RatesRequestDTO {
  name: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  subdistrict: string;
  address: string;
  postal_code: string;
  longitude: string;
  latitude: string;
  quantity: number;
  items: ProductDTO;
}

interface ProductDTO {
  id: string;
  name: string;
  price: number;
  height: string;
  weight: string;
  width: string;
  length: string;
}

export interface RatesResponseDTO {}
