export type UserRole = 'passenger' | 'driver' | 'admin';

export type ServiceType = 'taxi' | 'food' | 'delivery';

export type RideOption = 'moto_standard' | 'moto_plus';

export type PaymentMethod = 'mpesa' | 'emola' | 'cash' | 'wallet';

export interface LocationPoint {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface Driver {
  id: string;
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

export interface RideRequest {
  id: string;
  service: ServiceType;
  option: RideOption;
  origin: LocationPoint;
  destination: LocationPoint;
  fareMT: number;
  serviceFeeMT: number;
  totalMT: number;
  paymentMethod: PaymentMethod;
  status: 'searching' | 'accepted' | 'arrived' | 'in_transit' | 'completed' | 'cancelled';
  driver?: Driver;
  phonePayment?: string;
  date: string;
}

export interface WalletTransaction {
  id: string;
  type: 'topup' | 'payment' | 'earning';
  amountMT: number;
  method: PaymentMethod;
  description: string;
  timestamp: string;
  reference?: string;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  priceMT: number;
  image: string;
}

export interface RestaurantItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  deliveryTime: string;
  deliveryFeeMT: number;
  image: string;
  dishes: Dish[];
}

export interface CartItem {
  dish: Dish;
  quantity: number;
  restaurantName: string;
}
