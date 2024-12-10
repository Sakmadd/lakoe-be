import * as productRepo from '../repo/productRepo';
import ServiceResponseDTO from '../dtos/serviceResponseDto';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';
import { ProductsDTO } from '../dtos/products/productsDTO';
import { CreateProductDTO } from '../dtos/products/createProduct';
import { ProductType } from '../types/types';
import { SearchDTO } from '../dtos/products/searchProductDTO';

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

  async createProduct(
    data: CreateProductDTO,
  ): Promise<ServiceResponseDTO<CreateProductDTO | null>> {
    try {
      const product = await productRepo.createProduct(data);

      return new ServiceResponseDTO<CreateProductDTO>({
        error: false,
        message: null,
        payload: product,
      });
    } catch (error) {
      return serviceErrorHandler<CreateProductDTO | null>({
        error: true,
        message: error.message,
        payload: null,
      });
    }
  }

  async deleteProducts(
    id: string[],
  ): Promise<ServiceResponseDTO<ProductType[] | null>> {
    try {
      const product = await productRepo.getProductsByIds(id);

      await productRepo.deleteProducts(id);

      return new ServiceResponseDTO<ProductType[]>({
        error: false,
        message: null,
        payload: product,
      });
    } catch (error) {
      return serviceErrorHandler<ProductType[] | null>({
        error: true,
        message: error.message,
        payload: null,
      });
    }
  }

  async searchProducts(
    data: SearchDTO,
  ): Promise<ServiceResponseDTO<ProductsDTO[] | null>> {
    try {
      const products = await productRepo.searchProducts(data);

      return new ServiceResponseDTO<ProductsDTO[]>({
        error: false,
        message: null,
        payload: products,
      });
    } catch (error) {
      return serviceErrorHandler<ProductsDTO[] | null>({
        error: true,
        message: error.message,
        payload: null,
      });
    }
  }

  async getProductById(
    id: string,
  ): Promise<ServiceResponseDTO<ProductType | null>> {
    try {
      const product = await productRepo.getProductById(id);

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
}

export default new ProductService();
