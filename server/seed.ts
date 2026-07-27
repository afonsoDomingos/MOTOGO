import { connectDB } from './db.js';
import Location from './models/Location.js';
import Driver from './models/Driver.js';
import Restaurant from './models/Restaurant.js';
import Transaction from './models/Transaction.js';
import { MAPUTO_LOCATIONS, MOCK_DRIVERS, MOCK_RESTAURANTS, INITIAL_TRANSACTIONS } from '../src/data/mockData.js';

export const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🌱 A popular o banco de dados MongoDB (motogodb) com dados reais de Moçambique...');

    // Seed Locations if empty
    const locationCount = await Location.countDocuments();
    if (locationCount === 0) {
      await Location.insertMany(MAPUTO_LOCATIONS);
      console.log('✅ Locais de Maputo e Matola inseridos com sucesso no MongoDB.');
    }

    // Seed Drivers if empty
    const driverCount = await Driver.countDocuments();
    if (driverCount === 0) {
      await Driver.insertMany(MOCK_DRIVERS);
      console.log('✅ Motoristas MOTO GO inseridos com sucesso no MongoDB.');
    }

    // Seed Restaurants if empty
    const restaurantCount = await Restaurant.countDocuments();
    if (restaurantCount === 0) {
      await Restaurant.insertMany(MOCK_RESTAURANTS);
      console.log('✅ Restaurantes Moto Food inseridos com sucesso no MongoDB.');
    }

    // Seed Transactions if empty
    const txCount = await Transaction.countDocuments();
    if (txCount === 0) {
      const txsToInsert = INITIAL_TRANSACTIONS.map(tx => ({
        txId: tx.id,
        type: tx.type,
        amountMT: tx.amountMT,
        method: tx.method,
        description: tx.description,
        timestamp: tx.timestamp,
        reference: tx.reference
      }));
      await Transaction.insertMany(txsToInsert);
      console.log('✅ Transações iniciais em Meticais inseridas com sucesso no MongoDB.');
    }

    console.log('🎉 Banco de dados MongoDB motogodb pronto para produção!');
  } catch (error) {
    console.error('❌ Erro no Seeding do MongoDB:', error);
  }
};
