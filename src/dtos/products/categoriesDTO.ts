export interface CategoriesDTO {
  id: string;
  parent_id?: string;
  children?: CategoriesDTO[];
  label: string;
  value: string;
}
