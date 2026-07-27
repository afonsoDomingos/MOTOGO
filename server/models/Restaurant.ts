import mongoose, { Schema, Document } from 'mongoose';

export interface IDish {
  id: string;
  name: string;
  description: string;
  priceMT: number;
  image: string;
}

export interface IRestaurant extends Document {
  name: string;
  category: string;
  rating: number;
  deliveryTime: string;
  deliveryFeeMT: number;
  image: string;
  dishes: IDish[];
}

const DishSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  priceMT: { type: Number, required: true },
  image: { type: String, required: true }
});

const RestaurantSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, default: 4.8 },
  deliveryTime: { type: String, default: '20-30 min' },
  deliveryFeeMT: { type: Number, default: 60 },
  image: { type: String, required: true },
  dishes: [DishSchema]
}, { timestamps: true });

export default mongoose.models.Restaurant || mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);
