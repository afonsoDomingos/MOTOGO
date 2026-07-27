import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../server/db.js';
import { seedDatabase } from '../server/seed.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();
    await seedDatabase();
    res.status(200).json({ status: 'online', database: 'MongoDB Atlas - motogodb', time: new Date() });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Database connection error' });
  }
}
