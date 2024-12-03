export interface ShopUpdateDTO {
  id: string;
  description: string;
  slogan: string;
  phone: string;
  logo: string;
  user: User;
}

interface User {
  name: string;
}
