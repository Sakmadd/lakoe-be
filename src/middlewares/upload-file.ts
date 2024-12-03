import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { CONFIGS } from '../config/config';

cloudinary.config({
  cloud_name: CONFIGS.CLOUDINARY_CLOUD_NAME,
  api_key: CONFIGS.CLOUDINARY_API_KEY,
  api_secret: CONFIGS.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.body.filePath) {
      return res.status(400).json({ message: 'No file path provided' });
    }

    const absolutePath = path.resolve(req.body.filePath);

    const result = await cloudinary.uploader.upload(absolutePath, {
      folder: 'uploads',
    });

    req.body.imageUrl = result.secure_url;

    next();
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Image upload failed', error });
  }
};
