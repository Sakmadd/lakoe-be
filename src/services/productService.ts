import * as productRepo from '../repo/productRepo';
import ServiceResponseDTO from '../dtos/serviceResponseDto';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';
import { ProductType } from '../types/types';
import { ProductsDTO } from '../dtos/products/productsDTO';
import { CreateProductOnlyDTO } from '../dtos/products/CreateProductOnlyDTO';
import { CreateProductWithVariantDTO } from '../dtos/products/createProductWithVariant';

class ProductService {
  async getAllProducts(
    take: number,
    skip: number,
  ): Promise<ServiceResponseDTO<ProductsDTO[] | null>> {
    try {
      const products = await productRepo.getAllProducts(take, skip);

      return new ServiceResponseDTO<ProductsDTO[]>({
        error: false,
        message: null,
        payload: products,
      });
    } catch (error) {
      return serviceErrorHandler({
        error: true,
        message: error.message,
        payload: null,
      });
    }
  }

  async createProductWithoutVariant(
    data: CreateProductOnlyDTO,
  ): Promise<ServiceResponseDTO<ProductType | null>> {
    try {
      const product = await productRepo.createProductWithoutVariant(data);

      return new ServiceResponseDTO<ProductType>({
        error: false,
        message: null,
        payload: product,
      });
    } catch (error) {
      return serviceErrorHandler<ProductType | null>({
        error: true,
        message: error.message,
        payload: null,
      });
    }
  }
  async createProductWithVariant(
    data: CreateProductWithVariantDTO,
  ): Promise<ServiceResponseDTO<ProductType | null>> {
    try {
      return;
    } catch (error) {}
  }
}

export default new ProductService();
