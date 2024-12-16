import { v2 as cloudinary } from 'cloudinary';
import { ImageDTO } from '../dtos/admin/categoryDTO';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploader = async (files: Express.Multer.File[]) => {
  const urls: ImageDTO[] = [];
  await Promise.all(
    files.map(async (file) => {
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
      const uplaodedFile = await cloudinary.uploader.upload(dataURI, {
        folder: 'lakoe',
      });
      urls.push({
        alt: '',
        src: uplaodedFile.secure_url,
      });
    }),
  );
  return urls;
};
export default uploader;
