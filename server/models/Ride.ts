import mongoose, { Schema, Document } from 'mongoose';

export interface IRide extends Document {
  rideId: string;
  service: 'taxi' | 'food' | 'delivery';
  option: 'moto_standard' | 'moto_plus';
  origin: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
  destination: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
  fareMT: number;
  serviceFeeMT: number;
  totalMT: number;
  paymentMethod: 'mpesa' | 'emola' | 'cash' | 'wallet';
  status: 'idle' | 'searching' | 'accepted' | 'arrived' | 'in_transit' | 'completed' | 'cancelled';
  driverId?: string;
  driverName?: string;
  phonePayment?: string;
  date: string;
}

const RideSchema: Schema = new Schema({
  rideId: { type: String, required: true, unique: true },
  service: { type: String, enum: ['taxi', 'food', 'delivery'], default: 'taxi' },
  option: { type: String, enum: ['moto_standard', 'moto_plus'], default: 'moto_standard' },
  origin: {
    name: String,
    address: String,
    lat: Number,
    lng: Number
  },
  destination: {
    name: String,
    address: String,
    lat: Number,
    lng: Number
  },
  fareMT: { type: Number, required: true },
  serviceFeeMT: { type: Number, required: true },
  totalMT: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['mpesa', 'emola', 'cash', 'wallet'], required: true },
  status: {
    type: String,
    enum: ['idle', 'searching', 'accepted', 'arrived', 'in_transit', 'completed', 'cancelled'],
    default: 'searching'
  },
  driverId: { type: String },
  driverName: { type: String },
  phonePayment: { type: String },
  date: { type: String, default: () => new Date().toLocaleString('pt-MZ') }
}, { timestamps: true });

export default mongoose.models.Ride || mongoose.model<IRide>('Ride', RideSchema);
