export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  shop?: ShopDTO;
}

export interface ShopDTO {
  id: string;
  balance: number;
  description?: string;
  logo?: string;
}
