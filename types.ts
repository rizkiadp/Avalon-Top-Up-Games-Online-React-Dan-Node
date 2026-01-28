
export interface Game {
  id: string;
  name: string;
  category: string;
  image: string;
  isHot?: boolean;
  discount?: string;
  description: string;
  brand?: string; // Provider Game Code
  items?: GameItem[];
}

export interface GameItem {
  id: number;
  gameId: string;
  name: string;
  price: number;
  code: string;
  bonus?: string;
}

export interface Denomination {
  id: string;
  amount: string;
  price: number;
  bonus?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  group: 'E-Wallet' | 'Bank Transfer' | 'Retail' | 'Automatic';
}

export interface Transaction {
  id: string;
  gameId: string;
  gameName: string;
  gameIcon: string;
  item: string;
  amount: string;
  price: number;
  date: string;
  status: 'Success' | 'Pending' | 'Failed';
  userId: string;
  userGameId: string;
  timestamp: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  rank: number;
  credits: number;
  role: 'User' | 'Admin';
  vipLevel: string;
}

export interface Log {
  id: number;
  userId: number;
  username: string;
  action: string;
  details: string;
  ip: string;
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  isActive: boolean;
  actionUrl?: string;
}
