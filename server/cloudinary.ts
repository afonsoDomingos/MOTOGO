import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dnvnftvky',
  api_key: process.env.CLOUDINARY_API_KEY || '259851568455899',
  api_secret: process.env.CLOUDINARY_API_SECRET || '3hRsXzUVd3pnwn9IKQWN7UAeJLc'
});

export async function uploadImageToCloudinary(fileBase64: string, folder = 'motogo_uploads'): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder,
      resource_type: 'auto'
    });
    console.log(`✅ Imagem enviada para o Cloudinary (dnvnftvky): ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error('❌ Erro no upload para o Cloudinary:', error);
    throw error;
  }
}

export default cloudinary;
