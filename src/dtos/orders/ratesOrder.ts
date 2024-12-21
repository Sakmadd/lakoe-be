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

export interface RatesResponseDTO {
  price: number;
  company: string;
  origin_area_id: string;
  destination_area_id: string;
  courier_name: string;
  courier_code: string;
  courier_type: string;
  courier_image: string;
}
