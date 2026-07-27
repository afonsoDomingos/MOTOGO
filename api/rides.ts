import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../server/db.js';
import Ride from '../server/models/Ride.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();
    if (req.method === 'GET') {
      const rides = await Ride.find({}).sort({ createdAt: -1 });
      return res.status(200).json(rides);
    } else if (req.method === 'POST') {
      const rideData = req.body;
      const rideId = `RIDE-${Math.floor(1000 + Math.random() * 9000)}`;
      const newRide = new Ride({
        ...rideData,
        rideId,
        status: 'searching'
      });
      await newRide.save();
      return res.status(201).json(newRide);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao processar corridas' });
  }
}
