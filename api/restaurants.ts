import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../server/db.js';
import Restaurant from '../server/models/Restaurant.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();
    const restaurants = await Restaurant.find({});
    res.status(200).json(restaurants);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao buscar restaurantes' });
  }
}
