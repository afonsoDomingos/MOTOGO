import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// Fix Windows Node.js SRV DNS resolution for MongoDB Atlas cluster
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // fallback
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://karinganastudio23:VIbemongodb@cluster0.oe0akin.mongodb.net/motogodb?retryWrites=true&w=majority';

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return mongoose.connection;
    }
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB Atlas Conectado com Sucesso: ${conn.connection.host} / Database: ${conn.connection.name}`);
    return conn.connection;
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB Atlas:', error);
    return null;
  }
};
