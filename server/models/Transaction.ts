import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  txId: string;
  type: 'topup' | 'payment' | 'earning';
  amountMT: number;
  method: 'mpesa' | 'emola' | 'cash' | 'wallet';
  description: string;
  timestamp: string;
  reference?: string;
  phone?: string;
}

const TransactionSchema: Schema = new Schema({
  txId: { type: String, required: true, unique: true },
  type: { type: String, enum: ['topup', 'payment', 'earning'], required: true },
  amountMT: { type: Number, required: true },
  method: { type: String, enum: ['mpesa', 'emola', 'cash', 'wallet'], required: true },
  description: { type: String, required: true },
  timestamp: { type: String, default: () => new Date().toLocaleString('pt-MZ') },
  reference: { type: String },
  phone: { type: String }
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
