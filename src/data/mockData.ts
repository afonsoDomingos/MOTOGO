import type { LocationPoint, Driver, RestaurantItem, RideRequest, WalletTransaction } from '../types';

export const MAPUTO_LOCATIONS: LocationPoint[] = [
  {
    name: 'Av. Julius Nyerere, 1234',
    address: 'Av. Julius Nyerere, Polana Cimento, Maputo',
    lat: -25.9620,
    lng: 32.5895
  },
  {
    name: 'Maputo Shopping Centre',
    address: 'Rua das Estrelícias, Baixa, Maputo',
    lat: -25.9735,
    lng: 32.5680
  },
  {
    name: 'Praça dos Trabalhadores',
    address: 'Av. 25 de Setembro, Baixa, Maputo',
    lat: -25.9712,
    lng: 32.5645
  },
  {
    name: 'Polana Caniço A',
    address: 'Av. Vladimir Lenine, Maputo',
    lat: -25.9450,
    lng: 32.6020
  },
  {
    name: 'Praia da Costa do Sol',
    address: 'Av. da Marginal, Costa do Sol, Maputo',
    lat: -25.9280,
    lng: 32.6280
  },
  {
    name: 'Mercado Zimpeto',
    address: 'Estrada Nacional N1, Zimpeto, Maputo',
    lat: -25.8450,
    lng: 32.5700
  },
  {
    name: 'Terminal Rodoviário da Matola',
    address: 'Av. da União Africana, Matola',
    lat: -25.9610,
    lng: 32.4630
  }
];

export const MOCK_DRIVERS: Driver[] = [
  {
    id: 'drv-1',
    name: 'Manuel Ernesto',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    phone: '+258 84 912 3456',
    rating: 4.9,
    totalRides: 482,
    motorbike: 'Honda CG 125',
    plate: 'AJP 123 MP',
    lat: -25.9650,
    lng: 32.5850,
    status: 'available'
  },
  {
    id: 'drv-2',
    name: 'João Paulo',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    phone: '+258 86 543 2109',
    rating: 4.8,
    totalRides: 310,
    motorbike: 'TVS XL 100',
    plate: 'AJK 456 MP',
    lat: -25.9690,
    lng: 32.5750,
    status: 'available'
  },
  {
    id: 'drv-3',
    name: 'Celso Machava',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
    phone: '+258 84 333 8899',
    rating: 5.0,
    totalRides: 620,
    motorbike: 'Yamaha Crux 110',
    plate: 'MCB 789 MP',
    lat: -25.9580,
    lng: 32.5930,
    status: 'available'
  }
];

export const MOCK_RESTAURANTS: RestaurantItem[] = [
  {
    id: 'rest-1',
    name: 'Sabores da Polana',
    category: 'Grelhados & Frango Zambeziano',
    rating: 4.9,
    deliveryTime: '20 - 35 min',
    deliveryFeeMT: 60,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    dishes: [
      {
        id: 'd-1',
        name: 'Frango a Zambeziana',
        description: 'Frango grelhado no carvão marinado no leite de coco, alho e piripiri moçambicano.',
        priceMT: 450,
        image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 'd-2',
        name: 'Matapa com Caranguejo',
        description: 'Prato tradicional de folhas de mandioca, amendoim, leite de coco e caranguejo fresco.',
        priceMT: 380,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'
      }
    ]
  },
  {
    id: 'rest-2',
    name: 'Cantinho do Mar',
    category: 'Mariscos & Camarão',
    rating: 4.8,
    deliveryTime: '25 - 40 min',
    deliveryFeeMT: 70,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
    dishes: [
      {
        id: 'd-3',
        name: 'Camarão Grelhado à Lourenço Marques',
        description: 'Camarões tigre grelhados com molho especial de piripiri e batata frita.',
        priceMT: 650,
        image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 'd-4',
        name: 'Prego no Pão de Camarão',
        description: 'Sanduíche suculento no pão moçambicano caseiro com molho de alho.',
        priceMT: 280,
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80'
      }
    ]
  }
];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-1',
    type: 'topup',
    amountMT: 500,
    method: 'mpesa',
    description: 'Recarga de MotoSaldo via M-Pesa (84 123 4567)',
    timestamp: '25 Mai 2026 - 08:30',
    reference: 'MP892011'
  },
  {
    id: 'tx-2',
    type: 'payment',
    amountMT: 150,
    method: 'wallet',
    description: 'Corrida Moto Táxi: Av. Julius Nyerere -> Polana Cimento',
    timestamp: '25 Mai 2026 - 09:15',
    reference: 'RIDE-10492'
  }
];

export const RECENT_RIDES_HISTORY: RideRequest[] = [
  {
    id: 'RIDE-9021',
    service: 'taxi',
    option: 'moto_standard',
    origin: MAPUTO_LOCATIONS[0],
    destination: MAPUTO_LOCATIONS[1],
    fareMT: 80,
    serviceFeeMT: 10,
    totalMT: 90,
    paymentMethod: 'mpesa',
    status: 'completed',
    driver: MOCK_DRIVERS[0],
    date: '25 Mai 2026 - 09:41'
  },
  {
    id: 'RIDE-8842',
    service: 'delivery',
    option: 'moto_standard',
    origin: MAPUTO_LOCATIONS[2],
    destination: MAPUTO_LOCATIONS[4],
    fareMT: 120,
    serviceFeeMT: 15,
    totalMT: 135,
    paymentMethod: 'emola',
    status: 'completed',
    driver: MOCK_DRIVERS[1],
    date: '24 Mai 2026 - 16:15'
  }
];
