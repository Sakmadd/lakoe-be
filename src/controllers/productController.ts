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

      const productWithoutVariant =
        await productService.createProductWithoutVariant(data);

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
}

export default new productController();
