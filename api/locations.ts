import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../server/db.js';
import Location from '../server/models/Location.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();
    const locations = await Location.find({});
    res.status(200).json(locations);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao buscar locais' });
  }
}
