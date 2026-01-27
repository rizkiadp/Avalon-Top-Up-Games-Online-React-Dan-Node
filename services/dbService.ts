import { Game, Transaction, User, Denomination, PaymentMethod } from '../types';

const API_URL = '/api';

export const db = {
  // Games
  getGames: async (): Promise<Game[]> => {
    const res = await fetch(`${API_URL}/games`);
    if (!res.ok) throw new Error('Failed to fetch games');
    return res.json();
  },

  getGameById: async (id: string): Promise<Game | undefined> => {
    const res = await fetch(`${API_URL}/games/${id}`);
    if (!res.ok) return undefined;
    return res.json();
  },

  // Transactions
  addTransaction: async (txn: any): Promise<any> => {
    const res = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(txn)
    });
    if (!res.ok) throw new Error('Transaction failed');
    return res.json();
  },

  getTransactionById: async (id: string): Promise<Transaction | undefined> => {
    const res = await fetch(`${API_URL}/transactions/${id}`);
    if (!res.ok) return undefined;
    return res.json();
  },

  getTransactionsByUser: async (userId: string): Promise<Transaction[]> => {
    const res = await fetch(`${API_URL}/transactions/user/${userId}`);
    if (!res.ok) return [];
    return res.json();
  },

  // Auth (Mock for now, or could be real)
  login: (username: string): User => {
    // Keep local mock for auth simplicity per now, or move to backend if needed suited
    const isAdmin = username.toLowerCase() === 'admin';
    const user: User = {
      id: isAdmin ? 'ADMIN_01' : `USER_${Math.floor(Math.random() * 1000)}`,
      username: username,
      email: `${username.toLowerCase()}@avalon.net`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      rank: isAdmin ? 99 : 1,
      credits: isAdmin ? 100000000 : 500000,
      role: isAdmin ? 'Admin' : 'User',
      vipLevel: isAdmin ? 'God Mode' : 'Silver Member'
    };
    localStorage.setItem('avalon_session', JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem('avalon_session');
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem('avalon_session');
    return data ? JSON.parse(data) : null;
  },

  // Static Data
  getDenominations: (): Denomination[] => [
    { id: 'ml10', amount: '10 (9 + 1) Diamonds', price: 2700, bonus: '' },
    { id: 'ml14', amount: '14 (13 + 1) Diamonds', price: 3700, bonus: '' },
    { id: 'ml18', amount: '18 (17 + 1) Diamonds', price: 4700, bonus: '' },
    { id: 'ml36', amount: '36 (33 + 3) Diamonds', price: 9100, bonus: '' },
    { id: 'ml74', amount: '74 (67 + 7) Diamonds', price: 18400, bonus: '' },
    { id: 'mlwp', amount: 'Weekly Diamond Pass', price: 28000, bonus: 'HOT' },
    { id: 'ml222', amount: '222 (200 + 22) Diamonds', price: 55300, bonus: '' },
    { id: 'ml370', amount: '370 (333 + 37) Diamonds', price: 91800, bonus: '' },
    { id: 'mltp', amount: 'Twilight Pass', price: 147900, bonus: '' },
    { id: 'ml966', amount: '966 (836 + 130) Diamonds', price: 233900, bonus: '' },
    { id: 'ml2010', amount: '2010 (1708 + 302) Diamonds', price: 459600, bonus: 'BEST' },
  ],

  getPaymentMethods: (): PaymentMethod[] => [
    { id: 'midtrans', name: 'Instant Payment (QRIS/VA)', icon: 'payments', group: 'Automatic' }
  ]
};
