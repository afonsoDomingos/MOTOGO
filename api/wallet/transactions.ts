import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../../server/db.js';
import Transaction from '../../server/models/Transaction.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();
    const transactions = await Transaction.find({}).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao buscar transações' });
  }
}
