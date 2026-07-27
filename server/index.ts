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
import User from './models/User.js';
import { uploadImageToCloudinary } from './cloudinary.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
// Increased body payload size to 50mb to support high-resolution photos
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize DB & Seed Data
connectDB().then(() => {
  seedDatabase();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online', 
    database: 'MongoDB Atlas - motogodb', 
    storage: 'Cloudinary (dnvnftvky)',
    time: new Date() 
  });
});

// Cloudinary Image Upload Endpoint
app.post('/api/upload', async (req, res) => {
  try {
    const { image, folder } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Nenhuma imagem foi fornecida' });
    }
    const secureUrl = await uploadImageToCloudinary(image, folder || 'motogo_profiles');
    res.json({ url: secureUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao realizar upload no Cloudinary' });
  }
});

// Profile Photo Update Route (MongoDB)
app.patch('/api/users/photo', async (req, res) => {
  try {
    const { email, photoUrl } = req.body;
    if (!email || !photoUrl) {
      return res.status(400).json({ error: 'E-mail e URL da foto são obrigatórios' });
    }
    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { photo: photoUrl },
      { new: true }
    );
    res.json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar foto de perfil no MongoDB' });
  }
});

// Authentication (Login & Register)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user || user.passwordHash !== password) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        motoSaldo: user.motoSaldo,
        photo: user.photo
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao autenticar usuário' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role, phone } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado' });
    }

    const newUser = new User({
      email: email.toLowerCase(),
      passwordHash: password,
      name,
      role: role || 'passenger',
      phone,
      motoSaldo: role === 'passenger' ? 350.00 : 0
    });
    await newUser.save();

    res.status(201).json({
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        phone: newUser.phone,
        motoSaldo: newUser.motoSaldo
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
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
    console.log(`🚀 Servidor MongoDB REST API com Cloudinary rodando na porta ${PORT}`);
  });
}

export default app;
