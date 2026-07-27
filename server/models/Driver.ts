import mongoose, { Schema, Document } from 'mongoose';

export interface IDriver extends Document {
  name: string;
  photo: string;
  phone: string;
  rating: number;
  totalRides: number;
  motorbike: string;
  plate: string;
  lat: number;
  lng: number;
  status: 'available' | 'busy' | 'offline';
}

const DriverSchema: Schema = new Schema({
  name: { type: String, required: true },
  photo: { type: String, required: true },
  phone: { type: String, required: true },
  rating: { type: Number, default: 5.0 },
  totalRides: { type: Number, default: 0 },
  motorbike: { type: String, required: true },
  plate: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  status: { type: String, enum: ['available', 'busy', 'offline'], default: 'available' }
}, { timestamps: true });

export default mongoose.models.Driver || mongoose.model<IDriver>('Driver', DriverSchema);
