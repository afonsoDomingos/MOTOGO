import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../../server/db.js';
import Transaction from '../../server/models/Transaction.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();
    if (req.method === 'POST') {
      const { amountMT, method, phone } = req.body;
      const txId = `TX-${Date.now()}`;
      const reference = `${method.toUpperCase()}${Math.floor(100000 + Math.random() * 900000)}`;

      const newTx = new Transaction({
        txId,
        type: 'topup',
        amountMT,
        method,
        description: `Recarga via ${method.toUpperCase()} (${phone})`,
        timestamp: new Date().toLocaleString('pt-MZ'),
        reference,
        phone
      });
      await newTx.save();
      return res.status(201).json(newTx);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao processar recarga' });
  }
}
