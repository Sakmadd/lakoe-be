import * as productRepo from '../repo/productRepo';
import ServiceResponseDTO from '../dtos/serviceResponseDto';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';
import { ProductsDTO } from '../dtos/products/productsDTO';
import { CreateProductDTO } from '../dtos/products/createProduct';
import { ProductType } from '../types/types';
import { SearchDTO } from '../dtos/products/searchProductDTO';
import { ProductDetailDTO } from '../dtos/products/productDetailDTO';
import { ToggleProductDTO } from '../dtos/products/toggleProductDTO';

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
    user_id: string,
  ): Promise<ServiceResponseDTO<CreateProductDTO | null>> {
    try {
      const product = await productRepo.createProduct(data, user_id);

      return new ServiceResponseDTO<CreateProductDTO>({
        error: false,
        message: null,
        payload: product,
      });
    } catch (error) {
      return serviceErrorHandler<CreateProductDTO | null>({
        error: true,
        message: 'Service failed',
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
  ): Promise<ServiceResponseDTO<ProductDetailDTO | null>> {
    try {
      const product = await productRepo.getProductById(id);

      return new ServiceResponseDTO<ProductDetailDTO>({
        error: false,
        message: null,
        payload: product,
      });
    } catch (error) {
      return serviceErrorHandler<ProductDetailDTO | null>({
        error: true,
        message: error.message,
        payload: null,
      });
    }
  }

  async updateProductById(
    id: string,
    data: CreateProductDTO,
  ): Promise<ServiceResponseDTO<CreateProductDTO | null>> {
    try {
      const product = await productRepo.updateProductById(id, data);

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

  async toggleProductActive(
    id: string,
    isActive: boolean,
  ): Promise<ServiceResponseDTO<ToggleProductDTO | null>> {
    try {
      const product = await productRepo.toggleProductActive(id, isActive);

      return new ServiceResponseDTO<ToggleProductDTO>({
        error: false,
        message: null,
        payload: product,
      });
    } catch (error) {
      return serviceErrorHandler<ToggleProductDTO | null>({
        error: true,
        message: error.message,
        payload: null,
      });
    }
  }
}

export default new ProductService();
