import { Request, Response } from 'express';
import productService from '../services/productService';
import uploader from '../libs/cloudinary';

class productController {
  async getAllProducts(req: Request, res: Response) {
    const take = req.query.take ? +req.query.take : 20;
    const skip = req.query.skip ? +req.query.skip : 0;

    const products = await productService.getAllProducts(take, skip);
    if (!products) {
      return res.status(404).json({
        error: true,
        message: 'No products found in the database',
        data: null,
      });
    }
    return res.status(200).json({
      error: false,
      message: 'Products found',
      data: products,
    });
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
        return res.status(400).json({
          error: true,
          message: 'Please provide a valid product data',
          data: null,
        });
      }

      if (typeof data.Category === 'string') {
        data.Category = JSON.parse(data.Category);
      }

      if (typeof data.Variant === 'string') {
        data.Variant = JSON.parse(data.Variant);
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

      const product = await productService.createProduct(data, user_id);

      return res.status(201).json({
        error: false,
        message: 'Product created successfully',
        data: product,
      });
    } catch (error) {
      console.error('Error creating product:', error);
      return res.status(500).json({
        error: true,
        message: 'Error creating product controller',
        data: null,
      });
    }
  }

  async deleteProducts(req: Request, res: Response) {
    const { id } = req.body;

    const ids = Array.isArray(id) ? id : [id];

    if (!ids.every((id) => typeof id === 'string') || ids.length === 0) {
      return res.status(400).json({
        error: true,
        message:
          'Please provide a valid product ID or an array of product IDs to delete.',
        data: null,
      });
    }

    const product = await productService.deleteProducts(ids);
    if (!product) {
      return res.status(404).json({
        error: true,
        message: 'No product found in the database',
        data: null,
      });
    }
    return res.status(200).json({
      error: false,
      message: 'Product deleted',
      data: product,
    });
  }

  async searchProducts(req: Request, res: Response) {
    const search = req.query.search as string;

    const take = req.query.take ? +req.query.take : 20;
    const skip = req.query.skip ? +req.query.skip : 0;

    const products = await productService.searchProducts({
      search,
      take,
      skip,
    });

    if (!products) {
      return res.status(404).json({
        error: true,
        message: 'No products found',
        data: null,
      });
    }
    return res.status(200).json({
      error: false,
      message: 'Products found',
      data: products,
    });
  }

  async getProductById(req: Request, res: Response) {
    const { id } = req.params;

    const product = await productService.getProductById(id);

    if (!product) {
      return res.status(404).json({
        error: true,
        message: 'No product found',
        data: null,
      });
    }
    return res.status(200).json({
      error: false,
      message: 'Product found',
      data: product,
    });
  }

  async updateProductById(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;

    const product = await productService.updateProductById(id, data);

    if (!product) {
      return res.status(404).json({
        error: true,
        message: 'No product found',
        data: null,
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Product updated',
      data: product,
    });
  }

  async toggleProductActive(req: Request, res: Response) {
    const { id } = req.params;
    const isActive = req.body;

    const product = await productService.toggleProductActive(id, isActive);

    if (!product) {
      return res.status(404).json({
        error: true,
        message: 'No product found',
        data: null,
      });
    }
    return res.status(200).json({
      error: false,
      message: 'Product updated',
      data: product,
    });
  }
}

export default new productController();
