import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  UserRole,
  PaymentMethod,
  RideRequest,
  WalletTransaction,
  CartItem,
  Dish,
  Driver,
  RestaurantItem,
  LocationPoint
} from '../types';
import { INITIAL_TRANSACTIONS, MOCK_DRIVERS, RECENT_RIDES_HISTORY, MAPUTO_LOCATIONS, MOCK_RESTAURANTS } from '../data/mockData';

const API_BASE_URL = 'http://localhost:3001/api';

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

  // MongoDB Real Data
  locations: LocationPoint[];
  restaurants: RestaurantItem[];
  isMongoConnected: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('passenger');
  const [motoSaldo, setMotoSaldo] = useState<number>(350.00); // 350,00 MT matching screenshot
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [rideHistory, setRideHistory] = useState<RideRequest[]>(RECENT_RIDES_HISTORY);
  const [currentRide, setCurrentRide] = useState<RideRequest | null>(null);
  const [locations, setLocations] = useState<LocationPoint[]>(MAPUTO_LOCATIONS);
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>(MOCK_RESTAURANTS);
  const [isMongoConnected, setIsMongoConnected] = useState<boolean>(false);
  
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

  // Fetch Real Data from MongoDB on Mount
  useEffect(() => {
    const fetchMongoData = async () => {
      try {
        const resHealth = await fetch(`${API_BASE_URL}/health`);
        if (resHealth.ok) {
          setIsMongoConnected(true);

          // Locations
          const resLoc = await fetch(`${API_BASE_URL}/locations`);
          if (resLoc.ok) {
            const locData = await resLoc.json();
            if (locData.length > 0) setLocations(locData);
          }

          // Restaurants
          const resRest = await fetch(`${API_BASE_URL}/restaurants`);
          if (resRest.ok) {
            const restData = await resRest.json();
            if (restData.length > 0) setRestaurants(restData);
          }

          // Transactions
          const resTx = await fetch(`${API_BASE_URL}/wallet/transactions`);
          if (resTx.ok) {
            const txData = await resTx.json();
            if (txData.length > 0) {
              setTransactions(
                txData.map((t: any) => ({
                  id: t.txId || t._id,
                  type: t.type,
                  amountMT: t.amountMT,
                  method: t.method,
                  description: t.description,
                  timestamp: t.timestamp,
                  reference: t.reference
                }))
              );
            }
          }
        }
      } catch {
        setIsMongoConnected(false);
      }
    };

    fetchMongoData();
  }, []);

  const topupWallet = async (amount: number, method: PaymentMethod, phoneNumber: string): Promise<boolean> => {
    try {
      if (isMongoConnected) {
        const res = await fetch(`${API_BASE_URL}/wallet/topup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amountMT: amount, method, phone: phoneNumber })
        });
        if (res.ok) {
          const dbTx = await res.json();
          setMotoSaldo((prev) => prev + amount);
          setTransactions((prev) => [
            {
              id: dbTx.txId,
              type: dbTx.type,
              amountMT: dbTx.amountMT,
              method: dbTx.method,
              description: dbTx.description,
              timestamp: dbTx.timestamp,
              reference: dbTx.reference
            },
            ...prev
          ]);
          return true;
        }
      }
    } catch {
      // fallback
    }

    // Fallback simulation
    await new Promise((resolve) => setTimeout(resolve, 1500));
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

  const requestRide = async (rideData: Omit<RideRequest, 'id' | 'date' | 'status'>) => {
    const newRide: RideRequest = {
      ...rideData,
      id: `RIDE-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'searching',
      date: 'Agora'
    };

    // Save to MongoDB if connected
    if (isMongoConnected) {
      try {
        await fetch(`${API_BASE_URL}/rides`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRide)
        });
      } catch (err) {
        console.error('Error saving ride to MongoDB:', err);
      }
    }

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
        activeDriver,
        locations,
        restaurants,
        isMongoConnected
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
