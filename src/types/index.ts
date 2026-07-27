export type ServiceType = 'taxi' | 'food' | 'delivery';

export type PaymentMethod = 'mpesa' | 'emola' | 'cash' | 'wallet';

export type RideOption = 'moto_standard' | 'moto_plus';

export interface LocationPoint {
  lat: number;
  lng: number;
  address: string;
  name: string;
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
  status: 'idle' | 'searching' | 'accepted' | 'arrived' | 'in_transit' | 'completed' | 'cancelled';
  driver?: Driver;
  date: string;
  phonePayment?: string;
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

export interface Dish {
  id: string;
  name: string;
  description: string;
  priceMT: number;
  image: string;
}

export interface CartItem {
  dish: Dish;
  quantity: number;
  restaurantName: string;
}

export interface DeliveryPackage {
  senderAddress: string;
  recipientAddress: string;
  recipientName: string;
  recipientPhone: string;
  packageType: 'small' | 'medium' | 'large';
  observations?: string;
  paymentMethod: PaymentMethod;
  fareMT: number;
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

export type UserRole = 'passenger' | 'driver';
