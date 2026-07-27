import React, { createContext, useContext, useState } from 'react';
import type {
  UserRole,
  PaymentMethod,
  RideRequest,
  WalletTransaction,
  CartItem,
  Dish,
  Driver
} from '../types';
import { INITIAL_TRANSACTIONS, MOCK_DRIVERS, RECENT_RIDES_HISTORY } from '../data/mockData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  motoSaldo: number;
  transactions: WalletTransaction[];
  rideHistory: RideRequest[];
  currentRide: RideRequest | null;
  setCurrentRide: React.Dispatch<React.SetStateAction<RideRequest | null>>;
  topupWallet: (amount: number, method: PaymentMethod, phoneNumber: string) => Promise<boolean>;
  requestRide: (ride: Omit<RideRequest, 'id' | 'date' | 'status'>) => void;
  cancelRide: () => void;
  completeCurrentRide: () => void;
  
  // Cart for Moto Food
  cart: CartItem[];
  addToCart: (dish: Dish, restaurantName: string) => void;
  removeFromCart: (dishId: string) => void;
  clearCart: () => void;
  cartTotalMT: number;

  // Driver View State
  isDriverOnline: boolean;
  setIsDriverOnline: (online: boolean) => void;
  driverEarningsMT: number;
  availableRidesForDriver: RideRequest[];
  acceptRideAsDriver: (rideId: string) => void;
  activeDriver: Driver;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('passenger');
  const [motoSaldo, setMotoSaldo] = useState<number>(350.00); // 350,00 MT matching screenshot
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [rideHistory, setRideHistory] = useState<RideRequest[]>(RECENT_RIDES_HISTORY);
  const [currentRide, setCurrentRide] = useState<RideRequest | null>(null);
  
  // Moto Food cart
  const [cart, setCart] = useState<CartItem[]>([]);

  // Driver state
  const [isDriverOnline, setIsDriverOnline] = useState<boolean>(true);
  const [driverEarningsMT, setDriverEarningsMT] = useState<number>(1450.00);
  const [activeDriver] = useState<Driver>(MOCK_DRIVERS[0]);

  const [availableRidesForDriver, setAvailableRidesForDriver] = useState<RideRequest[]>([
    {
      id: 'REQ-9901',
      service: 'taxi',
      option: 'moto_standard',
      origin: { name: 'Polana Cimento, Av. Julius Nyerere', address: 'Av. Julius Nyerere, 1234', lat: -25.962, lng: 32.5895 },
      destination: { name: 'Maputo Shopping', address: 'Maputo Shopping Centre', lat: -25.9735, lng: 32.568 },
      fareMT: 80,
      serviceFeeMT: 10,
      totalMT: 90,
      paymentMethod: 'mpesa',
      status: 'searching',
      date: new Date().toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const topupWallet = async (amount: number, method: PaymentMethod, phoneNumber: string): Promise<boolean> => {
    // Simulate API delay for M-Pesa / e-Mola USSD push confirmation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setMotoSaldo((prev) => prev + amount);
    
    const newTx: WalletTransaction = {
      id: `TX-${Date.now()}`,
      type: 'topup',
      amountMT: amount,
      method,
      description: `Recarga via ${method.toUpperCase()} (${phoneNumber})`,
      timestamp: new Date().toLocaleString('pt-MZ'),
      reference: `${method.toUpperCase()}${Math.floor(100000 + Math.random() * 900000)}`
    };
    
    setTransactions((prev) => [newTx, ...prev]);
    return true;
  };

  const requestRide = (rideData: Omit<RideRequest, 'id' | 'date' | 'status'>) => {
    const newRide: RideRequest = {
      ...rideData,
      id: `RIDE-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'searching',
      date: 'Agora'
    };
    setCurrentRide(newRide);

    // If paying via wallet, deduct immediately
    if (rideData.paymentMethod === 'wallet') {
      setMotoSaldo((prev) => Math.max(0, prev - rideData.totalMT));
      setTransactions((prev) => [
        {
          id: `TX-${Date.now()}`,
          type: 'payment',
          amountMT: rideData.totalMT,
          method: 'wallet',
          description: `Pagamento de Corrida ${newRide.id}`,
          timestamp: new Date().toLocaleString('pt-MZ')
        },
        ...prev
      ]);
    }

    // Add to driver system queue as well
    setAvailableRidesForDriver((prev) => [newRide, ...prev]);

    // Simulate driver matching after 3 seconds
    setTimeout(() => {
      const assignedDriver = MOCK_DRIVERS[Math.floor(Math.random() * MOCK_DRIVERS.length)];
      setCurrentRide((prev) => (prev ? { ...prev, status: 'accepted', driver: assignedDriver } : null));
    }, 3000);
  };

  const cancelRide = () => {
    if (currentRide && currentRide.paymentMethod === 'wallet') {
      // Refund
      setMotoSaldo((prev) => prev + currentRide.totalMT);
    }
    setCurrentRide(null);
  };

  const completeCurrentRide = () => {
    if (currentRide) {
      const completed = { ...currentRide, status: 'completed' as const };
      setRideHistory((prev) => [completed, ...prev]);
      setCurrentRide(null);
    }
  };

  const addToCart = (dish: Dish, restaurantName: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { dish, quantity: 1, restaurantName }];
    });
  };

  const removeFromCart = (dishId: string) => {
    setCart((prev) => prev.filter((item) => item.dish.id !== dishId));
  };

  const clearCart = () => setCart([]);

  const cartTotalMT = cart.reduce((acc, item) => acc + item.dish.priceMT * item.quantity, 0);

  const acceptRideAsDriver = (rideId: string) => {
    const ride = availableRidesForDriver.find((r) => r.id === rideId);
    if (ride) {
      setAvailableRidesForDriver((prev) => prev.filter((r) => r.id !== rideId));
      setDriverEarningsMT((prev) => prev + ride.fareMT);
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        motoSaldo,
        transactions,
        rideHistory,
        currentRide,
        setCurrentRide,
        topupWallet,
        requestRide,
        cancelRide,
        completeCurrentRide,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotalMT,
        isDriverOnline,
        setIsDriverOnline,
        driverEarningsMT,
        availableRidesForDriver,
        acceptRideAsDriver,
        activeDriver
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
