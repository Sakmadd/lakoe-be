export interface addTemplateDTO {
  title: string;
  contain_message: string;
}
export interface getTemplateDTO {
  id: string;
  title: string;
  contain_message: string;
  createdAt: Date;
  updatedAt: Date;
}
