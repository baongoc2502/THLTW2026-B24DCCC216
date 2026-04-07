export interface Destination {
  id: string;
  name: string;
  image: string;
  location: string;
  type: 'biển' | 'núi' | 'thành phố';
  rating: number;
  price: number;
  description: string;
  visitDuration: number;
  foodCost: number;
  accommodationCost: number;
  transportCost: number;
}

export interface TripDay {
  id: string;
  day: number;
  destinations: Destination[];
}

export interface Itinerary {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  days: TripDay[];
  totalBudget: number;
  createdAt: string;
}

export const defaultDestinations: Destination[] = [
  {
    id: '1',
    name: 'Vịnh Hạ Long',
    image: 'https://vcdn1-dulich.vnecdn.net/2024/02/23/halong-bay-1708653747-3993-170-5513-5553-1708656553.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=bSI4v21l1XFuus1588UKZQ',
    location: 'Quảng Ninh',
    type: 'biển',
    rating: 4.8,
    price: 500000,
    description: 'Kỳ quan thiên nhiên thế giới',
    visitDuration: 4,
    foodCost: 200000,
    accommodationCost: 800000,
    transportCost: 300000,
  },
  {
    id: '2',
    name: 'Sapa',
    image: 'https://static.vinwonders.com/production/Sapa-Vietnam-In-March-banner.jpg',
    location: 'Lào Cai',
    type: 'núi',
    rating: 4.7,
    price: 400000,
    description: 'Thị trấn trong sương',
    visitDuration: 3,
    foodCost: 150000,
    accommodationCost: 600000,
    transportCost: 400000,
  },
  {
    id: '3',
    name: 'Đà Lạt',
    image: 'https://bloganchoi.com/wp-content/uploads/2021/11/review-da-lat-toan-canh-dat-lat-trong-suong-mu-som-mai-1.jpg',
    location: 'Lâm Đồng',
    type: 'núi',
    rating: 4.6,
    price: 350000,
    description: 'Thành phố ngàn hoa',
    visitDuration: 2,
    foodCost: 180000,
    accommodationCost: 500000,
    transportCost: 250000,
  },
  {
    id: '4',
    name: 'Phú Quốc',
    image: 'https://img.freepik.com/premium-photo/aerial-view-tropical-beach-phu-quoc-island-vietnam-fine-white-sand-beach-beautiful-blue-sea_706532-68.jpg?w=2000',
    location: 'Kiên Giang',
    type: 'biển',
    rating: 4.5,
    price: 600000,
    description: 'Đảo ngọc',
    visitDuration: 5,
    foodCost: 250000,
    accommodationCost: 1000000,
    transportCost: 400000,
  },
  {
    id: '5',
    name: 'Hà Nội',
    image: 'https://static.vinwonders.com/production/gioi-thieu-ve-ha-noi-banner.jpg',
    location: 'Hà Nội',
    type: 'thành phố',
    rating: 4.4,
    price: 300000,
    description: 'Thủ đô ngàn năm văn hiến',
    visitDuration: 3,
    foodCost: 200000,
    accommodationCost: 700000,
    transportCost: 200000,
  },
];