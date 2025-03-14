import { BatchDeleteDTO } from '../dtos/products/batchDeleteDTO';
import { CategoriesDTO } from '../dtos/products/categoriesDTO';
import { CreateProductDTO } from '../dtos/products/createProduct';
import { ProductByShopDTO } from '../dtos/products/ProductByShopDTO';
import { ProductDetailDTO } from '../dtos/products/productDetailDTO';
import { ProductsDTO } from '../dtos/products/productsDTO';
import { SearchDTO } from '../dtos/products/searchProductDTO';
import { ToggleProductDTO } from '../dtos/products/toggleProductDTO';
import { UpdatePriceDTO } from '../dtos/products/UpdateProductPriceDTO';
import { UpdateStockDTO } from '../dtos/products/updateProductStockDTO';
import ServiceResponseDTO from '../dtos/serviceResponseDto';
import * as productRepo from '../repo/productRepo';
import { serviceErrorHandler } from '../utils/serviceErrorHandler';

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
      return serviceErrorHandler<null>(error);
    }
  }

  async getProductsByShopId(
    id: string,
  ): Promise<ServiceResponseDTO<ProductByShopDTO[] | null>> {
    try {
      const products = await productRepo.getProductsByShopId(id);

      return new ServiceResponseDTO<ProductByShopDTO[]>({
        error: false,
        message: 'Products found',
        payload: products,
      });
    } catch (error) {
      return serviceErrorHandler<null>(error);
    }
  }

  async getAllCategories(): Promise<
    ServiceResponseDTO<CategoriesDTO[] | null>
  > {
    try {
      const categories = await productRepo.getAllCategories();

      return new ServiceResponseDTO<CategoriesDTO[]>({
        error: false,
        message: 'Categories found',
        payload: categories,
      });
    } catch (error) {
      return serviceErrorHandler<null>(error);
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
      return serviceErrorHandler<null>(error);
    }
  }

  async batchDelete(
    ids: string[],
  ): Promise<ServiceResponseDTO<BatchDeleteDTO | null>> {
    try {
      const product = await productRepo.batchDelete(ids);

      return new ServiceResponseDTO<BatchDeleteDTO>({
        error: false,
        message: null,
        payload: product,
      });
    } catch (error) {
      return serviceErrorHandler<null>(error);
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
      return serviceErrorHandler<null>(error);
    }
  }

  async getProductByUrl(
    id: string,
  ): Promise<ServiceResponseDTO<ProductDetailDTO | null>> {
    try {
      const product = await productRepo.getProductByUrl(id);

      return new ServiceResponseDTO<ProductDetailDTO>({
        error: false,
        message: null,
        payload: product,
      });
    } catch (error) {
      return serviceErrorHandler<null>(error);
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
      return serviceErrorHandler<null>(error);
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
      return serviceErrorHandler<null>(error);
    }
  }

  async updateProductPrice(
    data: UpdatePriceDTO,
  ): Promise<ServiceResponseDTO<UpdatePriceDTO | null>> {
    try {
      const product = await productRepo.updateProductPrice(data);

      return new ServiceResponseDTO<UpdatePriceDTO>({
        error: false,
        message: null,
        payload: product,
      });
    } catch (error) {
      return serviceErrorHandler<null>(error);
    }
  }

  async updateProductStock(
    data: UpdateStockDTO,
  ): Promise<ServiceResponseDTO<UpdateStockDTO | null>> {
    try {
      const product = await productRepo.updateProductStock(data);

      return new ServiceResponseDTO<UpdateStockDTO>({
        error: false,
        message: null,
        payload: product,
      });
    } catch (error) {
      return serviceErrorHandler<null>(error);
    }
  }

  async toggleProductActive(
    id: string,
  ): Promise<ServiceResponseDTO<ToggleProductDTO | null>> {
    try {
      const product = await productRepo.toggleProductActive(id);

      return new ServiceResponseDTO<ToggleProductDTO>({
        error: false,
        message: null,
        payload: product,
      });
    } catch (error) {
      return serviceErrorHandler<null>(error);
    }
  }

  async toggleProductsActive(
    ids: string[],
  ): Promise<ServiceResponseDTO<ToggleProductDTO[] | null>> {
    try {
      const products = await productRepo.toggleProductsActive(ids);

      return new ServiceResponseDTO<ToggleProductDTO[]>({
        error: false,
        message: null,
        payload: products,
      });
    } catch (error) {
      return serviceErrorHandler<null>(error);
    }
  }
}

export default new ProductService();
