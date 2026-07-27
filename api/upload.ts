import type { VercelRequest, VercelResponse } from '@vercel/node';
import { uploadImageToCloudinary } from '../server/cloudinary.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'POST') {
      const { image, folder } = req.body;
      if (!image) {
        return res.status(400).json({ error: 'Nenhuma imagem fornecida' });
      }
      const secureUrl = await uploadImageToCloudinary(image, folder || 'motogo_profiles');
      return res.status(200).json({ url: secureUrl });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro no upload para o Cloudinary' });
  }
}
