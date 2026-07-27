import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import { seedDatabase } from './seed.js';
import Location from './models/Location.js';
import Driver from './models/Driver.js';
import Restaurant from './models/Restaurant.js';
import Ride from './models/Ride.js';
import Transaction from './models/Transaction.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize DB & Seed Data
connectDB().then(() => {
  seedDatabase();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', database: 'MongoDB Atlas - motogodb', time: new Date() });
});

// Locations
app.get('/api/locations', async (req, res) => {
  try {
    const locations = await Location.find({});
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar locais' });
  }
});

// Drivers
app.get('/api/drivers', async (req, res) => {
  try {
    const drivers = await Driver.find({});
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar motoristas' });
  }
});

// Restaurants (Moto Food)
app.get('/api/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar restaurantes' });
  }
});

// Rides (Moto Táxi & Delivery)
app.get('/api/rides', async (req, res) => {
  try {
    const rides = await Ride.find({}).sort({ createdAt: -1 });
    res.json(rides);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar corridas' });
  }
});

app.post('/api/rides', async (req, res) => {
  try {
    const rideData = req.body;
    const rideId = `RIDE-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRide = new Ride({
      ...rideData,
      rideId,
      status: 'searching'
    });
    await newRide.save();
    res.status(201).json(newRide);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar corrida no MongoDB' });
  }
});

app.patch('/api/rides/:rideId', async (req, res) => {
  try {
    const { rideId } = req.params;
    const update = req.body;
    const updatedRide = await Ride.findOneAndUpdate({ rideId }, update, { new: true });
    res.json(updatedRide);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar corrida' });
  }
});

// Wallet & Payments (M-Pesa / e-Mola)
app.get('/api/wallet/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find({}).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar transações' });
  }
});

app.post('/api/wallet/topup', async (req, res) => {
  try {
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
    res.status(201).json(newTx);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar recarga no MongoDB' });
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor MongoDB REST API rodando na porta ${PORT}`);
  });
}

export default app;
