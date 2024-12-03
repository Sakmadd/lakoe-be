export interface UserType {
  id: string;
  shop_id: string;
  name: string;
  email: string;
  password?: string;
}

export interface UserDetailType extends UserType {
  Shop: ShopType;
}

export interface ShopType {
  id: string;
  phone?: string;
  description?: string;
  slogan?: string;
  logo?: string;
  balance: number;
  location?: LocationType[];
  product?: ProductType[];
  user?: UserType;
}

export interface LocationType {
  id: string;
  name: string;
  address: string;
  city: string;
  district: string;
  postal_code: string;
  longitude: string;
  latitude: string;
}

export interface ProductType {}
