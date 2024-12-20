export interface UpdateLocationDTO {
  name: string;
  province: string;
  city: string;
  district: string;
  subdistrict: string;
  address: string;
  postal_code: string;
  longitude: string;
  latitude: string;
  is_main: boolean;
}
export interface updateMainLocation {
  is_main: boolean;
}
