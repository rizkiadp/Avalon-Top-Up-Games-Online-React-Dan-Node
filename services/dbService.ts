import { Game, Transaction, User, Denomination, PaymentMethod } from '../types';

const API_URL = 'http://localhost:5000/api';

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

  // Banners
  getBanners: async (activeOnly: boolean = false): Promise<any[]> => {
    const res = await fetch(`${API_URL}/banners${activeOnly ? '?active=true' : ''}`);
    if (!res.ok) return [];
    return res.json();
  },

  createBanner: async (banner: any): Promise<any> => {
    const res = await fetch(`${API_URL}/banners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(banner)
    });
    if (!res.ok) throw new Error('Failed to create banner');
    return res.json();
  },

  updateBanner: async (id: number, data: any): Promise<any> => {
    const res = await fetch(`${API_URL}/banners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update banner');
    return res.json();
  },

  deleteBanner: async (id: number): Promise<any> => {
    const res = await fetch(`${API_URL}/banners/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete banner');
    return res.json();
  },

  // Auth (Legacy/Mock - partially replaced by backend)
  login: (username: string): User => {
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

  changePassword: async (userId: string, oldPassword: string, newPassword: string): Promise<any> => {
    const res = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, oldPassword, newPassword })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to change password');
    }
    return res.json();
  },

  changeEmail: async (userId: string, password: string, newEmail: string): Promise<any> => {
    const res = await fetch(`${API_URL}/auth/change-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password, newEmail })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update email');
    }
    return res.json();
  },

  verifyEmail: async (email: string, otp: string): Promise<any> => {
    const res = await fetch(`${API_URL}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Verification failed');
    }
    return res.json();
  },

  getCurrentUser: (): User | null => {
    try {
      const data = localStorage.getItem('avalon_session');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Session Parse Error", e);
      localStorage.removeItem('avalon_session'); // Clear bad data
      return null;
    }
  },

  // Logs
  getLogs: async (): Promise<any[]> => {
    const res = await fetch(`${API_URL}/logs`);
    if (!res.ok) return [];
    return res.json();
  },

  // Vouchers
  createVoucher: async (voucher: any): Promise<any> => {
    const res = await fetch(`${API_URL}/vouchers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(voucher)
    });
    if (!res.ok) throw new Error('Failed to create voucher');
    return res.json();
  },

  getVouchers: async (): Promise<any[]> => {
    const res = await fetch(`${API_URL}/vouchers`);
    if (!res.ok) return [];
    return res.json();
  },

  deleteVoucher: async (id: number): Promise<any> => {
    const res = await fetch(`${API_URL}/vouchers/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete voucher');
    return res.json();
  },

  verifyVoucher: async (code: string, gameId?: string | number): Promise<any> => {
    const res = await fetch(`${API_URL}/vouchers/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, gameId })
    });
    // Return the handle logic in component (valid: true/false)
    return res.json();
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
