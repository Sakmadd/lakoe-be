/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import ResponseDTO from '../dtos/responseDto';
import uploader from '../libs/cloudinary';
import productService from '../services/productService';

class productController {
  async getAllProducts(req: Request, res: Response) {
    const take = req.query.take ? +req.query.take : 20;
    const skip = req.query.skip ? +req.query.skip : 0;

    const { error, message, payload } = await productService.getAllProducts(
      take,
      skip,
    );
    if (error) {
      return res.status(404).json(
        new ResponseDTO({
          error: error,
          message: 'No products found in the database',
          data: null,
        }),
      );
    }
    return res.status(200).json(
      new ResponseDTO({
        error: error,
        message: message,
        data: payload,
      }),
    );
  }

  async getProductsByShopId(req: Request, res: Response) {
    const id = res.locals.user.shop_id;

    const { error, message, payload } =
      await productService.getProductsByShopId(id);

    if (error) {
      return res.status(404).json(
        new ResponseDTO({
          error: error,
          message: 'No products found in the database',
          data: null,
        }),
      );
    }

    return res.status(200).json(
      new ResponseDTO({
        error: error,
        message: message,
        data: payload,
      }),
    );
  }

  async getAllCategories(req: Request, res: Response) {
    const { error, message, payload } = await productService.getAllCategories();
    if (error) {
      return res.status(404).json(
        new ResponseDTO({
          error: error,
          message: 'No categories found in the database',
          data: null,
        }),
      );
    }
    return res.status(200).json(
      new ResponseDTO({
        error: error,
        message: message,
        data: payload,
      }),
    );
  }

  async createProduct(req: Request, res: Response) {
    try {
      const data = req.body;

      const fetchImages = req.files as Express.Multer.File[];
      const user_id = res.locals.user.id;

      data.price = +data.price;
      data.length = +data.length;
      data.width = +data.width;
      data.height = +data.height;
      data.stock = +data.stock;
      data.weight = +data.weight;
      data.minimum_order = +data.minimum_order;

      if (!data) {
        return res.status(400).json(
          new ResponseDTO({
            error: true,
            message: 'Please provide a valid product data',
            data: null,
          }),
        );
      }

      if (typeof data.Variant === 'string') {
        data.Variant = JSON.parse(data.Variant);
      }

      if (Array.isArray(data.Variant)) {
        data.Variant = data.Variant.map((variant: any) => {
          if (Array.isArray(variant.options)) {
            variant.options = variant.options.map((option: any) => {
              if (typeof option === 'string') {
                return JSON.parse(option);
              }
              return option;
            });
          } else {
            variant.options = [];
          }
          return variant;
        });
      }

      if (typeof data.VariantOptionCombination === 'string') {
        data.VariantOptionCombination = JSON.parse(
          data.VariantOptionCombination,
        );
      }

      if (typeof data.is_active === 'string') {
        data.is_active = data.is_active === 'true';
      }

      if (fetchImages.length > 0) {
        const imageUrls = await Promise.all(
          fetchImages.map(async (file) => {
            const url = await uploader(file);
            return { src: url };
          }),
        );
        data.Images = imageUrls;
      }

      const { error, message, payload } = await productService.createProduct(
        data,
        user_id,
      );

      return res.status(201).json(
        new ResponseDTO({
          error: error,
          message: message,
          data: payload,
        }),
      );
    } catch (error) {
      console.error('Error creating product:', error);
      return res.status(500).json({
        error: error,
        message: 'Error creating product controller',
        data: null,
      });
    }
  }

  async searchProducts(req: Request, res: Response) {
    const search = req.query.search as string;

    const take = req.query.take ? +req.query.take : 20;
    const skip = req.query.skip ? +req.query.skip : 0;

    const { error, message, payload } = await productService.searchProducts({
      search,
      take,
      skip,
    });

    if (error) {
      res.status(404).json(
        new ResponseDTO({
          error: true,
          message: message,
          data: null,
        }),
      );
    }

    return res.status(200).json(
      new ResponseDTO({
        error: error,
        message: message,
        data: payload,
      }),
    );
  }

  async getProductByUrl(req: Request, res: Response) {
    const { url } = req.params;

    const { error, message, payload } =
      await productService.getProductByUrl(url);

    if (error) {
      res.status(404).json(
        new ResponseDTO({
          error: true,
          message: message,
          data: null,
        }),
      );
    }

    return res.status(200).json(
      new ResponseDTO({
        error: error,
        message: message,
        data: payload,
      }),
    );
  }

  async getProductById(req: Request, res: Response) {
    const { id } = req.params;

    const { error, message, payload } = await productService.getProductById(id);

    if (error) {
      res.status(404).json(
        new ResponseDTO({
          error: true,
          message: message,
          data: null,
        }),
      );
    }

    return res.status(200).json(
      new ResponseDTO({
        error: error,
        message: message,
        data: payload,
      }),
    );
  }

  async updateProductById(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;
    const fetchImages = req.files as Express.Multer.File[];

    data.price = +data.price;
    data.length = +data.length;
    data.width = +data.width;
    data.height = +data.height;
    data.stock = +data.stock;
    data.weight = +data.weight;
    data.minimum_order = +data.minimum_order;

    if (!data) {
      return res.status(400).json(
        new ResponseDTO({
          error: true,
          message: 'Please provide a valid product data',
          data: null,
        }),
      );
    }

    if (typeof data.Variant === 'string') {
      data.Variant = JSON.parse(data.Variant);
    }

    if (Array.isArray(data.Variant)) {
      data.Variant = data.Variant.map((variant: any) => {
        if (Array.isArray(variant.options)) {
          variant.options = variant.options.map((option: any) => {
            if (typeof option === 'string') {
              return JSON.parse(option);
            }
            return option;
          });
        } else {
          variant.options = [];
        }
        return variant;
      });
    }

    if (typeof data.VariantOptionCombination === 'string') {
      data.VariantOptionCombination = JSON.parse(data.VariantOptionCombination);
    }

    if (typeof data.is_active === 'string') {
      data.is_active = data.is_active === 'true';
    }

    if (fetchImages.length > 0) {
      const imageUrls = await Promise.all(
        fetchImages.map(async (file) => {
          const url = await uploader(file);
          return { src: url };
        }),
      );
      data.Images = imageUrls;
    }

    const { error, message, payload } = await productService.updateProductById(
      id,
      data,
    );

    if (error) {
      return res.status(404).json(
        new ResponseDTO({
          error: true,
          message: message,
          data: null,
        }),
      );
    }

    return res.status(200).json(
      new ResponseDTO({
        error: error,
        message: message,
        data: payload,
      }),
    );
  }

  async batchDelete(req: Request, res: Response) {
    const id = req.body;

    if (!Array.isArray(id) || id.length === 0) {
      return res.status(400).json({
        error: true,
        message: 'Please provide an array of product id',
        data: null,
      });
    }

    const { error, message, payload } = await productService.batchDelete(id);

    if (error) {
      return res.status(404).json({
        error: error,
        message: message,
        data: null,
      });
    }
    return res.status(200).json(
      new ResponseDTO({
        error: error,
        message: 'Product deleted',
        data: payload,
      }),
    );
  }

  async updateProductPrice(req: Request, res: Response) {
    const price = req.body;
    const { id } = req.params;

    const { error, message, payload } = await productService.updateProductPrice(
      { id, price },
    );

    if (error) {
      return res.status(404).json(
        new ResponseDTO({
          error: true,
          message: message,
          data: null,
        }),
      );
    }

    return res.status(200).json(
      new ResponseDTO({
        error: error,
        message: message,
        data: payload,
      }),
    );
  }

  async updateProductStock(req: Request, res: Response) {
    const stock = req.body;
    const { id } = req.params;

    const { error, message, payload } = await productService.updateProductStock(
      { id, stock },
    );

    if (error) {
      return res.status(404).json(
        new ResponseDTO({
          error: true,
          message: message,
          data: null,
        }),
      );
    }

    return res.status(200).json(
      new ResponseDTO({
        error: error,
        message: message,
        data: payload,
      }),
    );
  }

  async toggleProductActive(req: Request, res: Response) {
    const { id } = req.params;
    const { error, message, payload } =
      await productService.toggleProductActive(id);

    if (error) {
      return res.status(404).json({
        error: error,
        message: message,
        data: null,
      });
    }
    return res.status(200).json(
      new ResponseDTO({
        error: error,
        message: 'Product updated',
        data: payload,
      }),
    );
  }

  async toggleProductsActive(req: Request, res: Response) {
    const id = req.body;

    if (!Array.isArray(id) || id.length === 0) {
      return res.status(400).json({
        error: true,
        message: 'Please provide an array of product id',
        data: null,
      });
    }

    const { error, message, payload } =
      await productService.toggleProductsActive(id);

    if (error) {
      return res.status(404).json({
        error: error,
        message: message,
        data: null,
      });
    }
    return res.status(200).json(
      new ResponseDTO({
        error: error,
        message: message,
        data: payload,
      }),
    );
  }
}

export default new productController();
