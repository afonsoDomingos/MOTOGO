import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

const LocationSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.models.Location || mongoose.model<ILocation>('Location', LocationSchema);
