import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: 'passenger' | 'driver' | 'admin';
  phone?: string;
  motoSaldo?: number;
  photo?: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['passenger', 'driver', 'admin'], required: true },
  phone: { type: String },
  motoSaldo: { type: Number, default: 350.00 },
  photo: { type: String }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
