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

      const fetchFiles = req.files as Express.Multer.File[];

      if (fetchFiles && fetchFiles.length > 0) {
        const urls = await Promise.all(
          fetchFiles.map(async (file) => {
            const url = await uploader(file);
            console.log('Uploaded image URL:', url);
            return { url };
          }),
        );
        data.productImages = urls;
      }

      const productWithoutVariant = await productService.createProduct(data);

      return res.status(200).json({
        error: false,
        message: 'Product created',
        data: productWithoutVariant,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: error.message,
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
}

export default new productController();
