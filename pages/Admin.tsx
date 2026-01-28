
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Game, Transaction, Log } from '../types';
import { db } from '../services/dbService';

const API_URL = 'http://localhost:5000/api';

const BannerManager: React.FC<{
  banners: any[],
  onUpdate: () => void
}> = ({ banners, onUpdate }) => {
  const [newBanner, setNewBanner] = useState({
    title: '',
    imageUrl: '',
    isActive: true,
    actionUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await db.createBanner(newBanner);
      onUpdate();
      setNewBanner({ title: '', imageUrl: '', isActive: true, actionUrl: '' });
    } catch (error) {
      console.error(error);
      alert('Failed to create banner');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await db.deleteBanner(id);
      onUpdate();
    } catch (error) {
      console.error(error);
      alert('Failed to delete banner');
    }
  };

  const handleToggleActive = async (banner: any) => {
    try {
      await db.updateBanner(banner.id, { isActive: !banner.isActive });
      onUpdate();
    } catch (error) {
      console.error(error);
      alert('Failed to update banner');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter">BANNER SYSTEM</h2>
          <p className="text-slate-400 mt-1 font-body">Manage the main announcement banner on the landing page.</p>
        </div>
        <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          Live Management
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Banner Form */}
        <div>
          <div className="glass-panel p-6 rounded-2xl border border-dark relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-purple-500/20 transition-colors"></div>

            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-400">add_photo_alternate</span>
              New Banner
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Banner Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lunar New Year Promo"
                  value={newBanner.title}
                  onChange={e => setNewBanner({ ...newBanner, title: e.target.value })}
                  className="w-full bg-surface-dark border border-dark rounded-xl px-4 py-3 text-sm focus:border-purple-500 focus:outline-none placeholder:text-slate-600 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Image URL (Wide)</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={newBanner.imageUrl}
                  onChange={e => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                  className="w-full bg-surface-dark border border-dark rounded-xl px-4 py-3 text-sm focus:border-purple-500 focus:outline-none placeholder:text-slate-600 transition-colors"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-10 h-6 rounded-full p-1 transition-colors ${newBanner.isActive ? 'bg-purple-500' : 'bg-surface-dark border border-dark'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${newBanner.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">Set as Active Immediately</span>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={newBanner.isActive}
                    onChange={e => setNewBanner({ ...newBanner, isActive: e.target.checked })}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 mt-4"
              >
                {isLoading ? 'Uploading...' : 'Publish Banner'}
              </button>
            </form>
          </div>
        </div>

        {/* Banner List */}
        <div className="lg:col-span-2 space-y-4">
          {banners.length === 0 ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-4 glass-panel rounded-2xl border border-dark border-dashed">
              <span className="material-symbols-outlined text-4xl opacity-20">broken_image</span>
              <p className="text-xs font-mono uppercase tracking-widest">No banners found</p>
            </div>
          ) : (
            banners.map(banner => (
              <div key={banner.id} className={`glass-panel p-4 rounded-2xl border transition-all flex gap-4 ${banner.isActive ? 'border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'border-dark opacity-75 hover:opacity-100'}`}>
                {/* Image Preview */}
                <div className="w-48 h-28 shrink-0 rounded-lg overflow-hidden bg-surface-dark relative">
                  <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                  {banner.isActive && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-[9px] font-bold uppercase rounded-md shadow-lg">Active</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-bold text-lg leading-tight mb-1">{banner.title}</h3>
                    <p className="text-[10px] text-slate-500 font-mono truncate max-w-md">{banner.imageUrl}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleActive(banner)}
                      disabled={banner.isActive}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${banner.isActive ? 'bg-green-500/10 text-green-500 cursor-default' : 'bg-surface-dark hover:bg-white/10 text-slate-400 hover:text-white'}`}
                    >
                      {banner.isActive ? 'Currently Active' : 'Set Active'}
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all ml-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'games' | 'transactions' | 'logs' | 'vouchers' | 'banners'>('overview');
  const [games, setGames] = useState<Game[]>([]);
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    successRate: 0,
    activeGames: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Security Check
    const user = JSON.parse(localStorage.getItem('avalon_session') || '{}');
    if (!user || user.role !== 'Admin') {
      navigate('/');
    }
  }, []);

  // Game Form State
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentGame, setCurrentGame] = useState<Partial<Game>>({
    id: '',
    name: '',
    category: 'RPG',
    image: '',
    description: '',
    isHot: false,
    discount: '',
    brand: ''
  });

  // Item Management State
  const [showItemModal, setShowItemModal] = useState(false);
  const [currentItems, setCurrentItems] = useState<any[]>([]);
  const [selectedGameForItems, setSelectedGameForItems] = useState<Game | null>(null);
  const [newItem, setNewItem] = useState<any>({ name: '', price: 0, code: '', bonus: '' });

  const handleManageItems = (game: Game) => {
    setSelectedGameForItems(game);
    setCurrentItems(game.items || []);
    setShowItemModal(true);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGameForItems) return;
    try {
      let res;
      if (newItem.id) {
        // Update
        res = await fetch(`${API_URL}/games/items/${newItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem)
        });
      } else {
        // Create
        res = await fetch(`${API_URL}/games/${selectedGameForItems.id}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem)
        });
      }

      if (res.ok) {
        // Refresh Game Data
        fetchData();

        if (newItem.id) {
          // Update local state properly
          setCurrentItems(prev => prev.map(item => item.id === newItem.id ? { ...item, ...newItem } : item));
        } else {
          // Add new item
          const savedItem = await res.json();
          setCurrentItems([...currentItems, savedItem]);
        }

        // Reset form
        setNewItem({ name: '', price: 0, code: '', bonus: '' });
      }
    } catch (error) {
      console.error("Failed to add item", error);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!window.confirm("Delete item?")) return;
    try {
      await fetch(`${API_URL}/games/items/${itemId}`, { method: 'DELETE' });
      setCurrentItems(currentItems.filter(i => i.id !== itemId));
      fetchData();
    } catch (error) { console.error("Failed delete item", error); }
  };

  // Fetch Data
  const fetchData = async () => {
    // Games
    try {
      const gamesRes = await fetch(`${API_URL}/games`);
      if (gamesRes.ok) setGames(await gamesRes.json());
    } catch (e) { console.error("Games fetch error", e); }

    // Banners
    try {
      const bannersData = await db.getBanners();
      setBanners(bannersData);
    } catch (e) { console.error("Banners fetch error", e); }

    // Traffic Stats
    try {
      const res = await fetch(`${API_URL}/analytics/traffic`);
      if (res.ok) setTrafficData(await res.json());
    } catch (e) { console.error("Traffic fetch error", e); }

    // Vouchers
    try {
      const vouchersData = await db.getVouchers();
      setVouchers(vouchersData);
    } catch (e) { console.error("Vouchers fetch error", e); }

    // Transactions
    try {
      const txnsRes = await fetch(`${API_URL}/transactions`);
      if (txnsRes.ok) {
        const txns = await txnsRes.json();
        setTxns(txns);
      }
    } catch (e) { console.error("Transactions fetch error", e); }

    // Logs
    try {
      const logsData = await db.getLogs();
      setLogs(logsData);
    } catch (e) { console.error("Logs fetch error", e); }

    // Stats
    try {
      const statsRes = await fetch(`${API_URL}/transactions/stats`);
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (e) { console.error("Stats fetch error", e); }
  };

  useEffect(() => {
    fetchData();
  }, []); // Run on mount

  const handleSaveGame = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await fetch(`${API_URL}/games/${currentGame.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentGame)
        });
      } else {
        // For new games, if ID is empty, we might want to let backend handle it or user input.
        // Currently UI has an input for ID.
        await fetch(`${API_URL}/games`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentGame)
        });
      }
      setShowModal(false);
      resetForm();
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Error saving game:", error);
      alert("Failed to save game");
    }
  };

  const resetForm = () => {
    setCurrentGame({ id: '', name: '', category: 'RPG', image: '', description: '', isHot: false, discount: '' });
    setIsEditing(false);
  };

  const handleEdit = (game: Game) => {
    setCurrentGame(game);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this sector data permanently?")) {
      try {
        await fetch(`${API_URL}/games/${id}`, { method: 'DELETE' });
        fetchData(); // Refresh list
      } catch (error) {
        console.error("Error deleting game:", error);
        alert("Failed to delete game");
      }
    }
  };

  return (
    <div className="min-h-screen pt-20 flex flex-col">
      <div className="flex flex-1">
        {/* Admin Sidebar */}
        <aside className="w-64 glass-panel border-r border-dark hidden md:flex flex-col p-6 gap-8">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
            </div>
            <span className="text-sm font-bold tracking-widest uppercase">Admin Node</span>
          </div>

          <nav className="flex flex-col gap-2">
            {[
              { id: 'overview', icon: 'dashboard', label: 'Overview' },
              { id: 'games', icon: 'sports_esports', label: 'Manage Games' },
              { id: 'transactions', icon: 'account_balance_wallet', label: 'Transactions' },
              { id: 'vouchers', icon: 'confirmation_number', label: 'Vouchers' },
              { id: 'banners', icon: 'ad_units', label: 'Banners' },
              { id: 'logs', icon: 'terminal', label: 'System Logs' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${activeTab === tab.id
                  ? 'bg-primary/20 text-primary border border-primary/30 shadow-neon'
                  : 'text-slate-500 hover:text-main hover:bg-white/5'
                  }`}
              >
                <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-dark">
            <div className="bg-surface-dark p-4 rounded-xl border border-dark space-y-2">
              <p className="text-[10px] text-slate-500 font-bold uppercase">Mainframe Security</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-green-400 font-mono">ENCRYPTED</span>
                <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-80px)]">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">OPERATIONAL DASHBOARD</h1>
                <p className="text-slate-400 mt-1 uppercase text-xs tracking-widest font-mono">System Health: Optimal // Node-01 Online</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Net Revenue" value={`Rp ${stats.totalRevenue ? stats.totalRevenue.toLocaleString() : 0}`} icon="payments" color="primary" trend="+12%" />
                <StatCard label="Total Orders" value={stats.totalOrders} icon="receipt_long" color="secondary" trend="+5%" />
                <StatCard label="Success Rate" value={`${stats.successRate}%`} icon="verified" color="green-400" trend="Stable" />
                <StatCard label="Active Games" value={stats.activeGames} icon="games" color="orange-400" trend="Manual" />
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="glass-panel p-6 rounded-2xl border border-dark">
                  <h2 className="font-bold text-lg mb-6 uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">timeline</span>
                    Traffic Analysis (Last 7 Days)
                  </h2>
                  <div className="h-64 flex items-end gap-2 px-4">
                    {trafficData.length > 0 ? (
                      trafficData.map((day: any, i: number) => {
                        const maxVisits = Math.max(...trafficData.map((d: any) => d.visits)) || 10;
                        const height = (day.visits / maxVisits) * 100;
                        return (
                          <div key={i} className="flex-1 bg-primary/20 hover:bg-primary transition-all rounded-t-lg group relative" style={{ height: `${height}%` }}>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-dark px-2 py-1 rounded text-[8px] opacity-0 group-hover:opacity-100 transition-opacity border border-primary/30 whitespace-nowrap z-10">
                              {day.date}: {day.visits} Visits
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                        No traffic data available
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between mt-4 text-[10px] text-slate-500 font-mono">
                    <span>00:00</span>
                    <span>12:00</span>
                    <span>23:59</span>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-dark">
                  <h2 className="font-bold text-lg mb-6 uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">notifications</span>
                    System Logs
                  </h2>
                  <div className="space-y-4">
                    {logs.slice(0, 5).map((log, i) => (
                      <div key={log.id} className="flex items-center justify-between text-xs p-3 bg-white/5 rounded-lg border border-dark">
                        <div className="flex items-center gap-3">
                          <span className={`font-mono font-bold uppercase ${log.action.includes('FAILED') || log.action.includes('error') ? 'text-red-400' : 'text-primary'}`}>[{log.action}]</span>
                          <span className="text-slate-300 truncate max-w-[200px]">{log.details}</span>
                        </div>
                        <span className="text-slate-500 font-mono text-[10px] whitespace-nowrap">{new Date(log.createdAt).toLocaleTimeString()}</span>
                      </div>
                    ))}
                    {logs.length === 0 && <p className="text-slate-500 text-xs italic">No system logs available.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'games' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight uppercase">Game Library</h1>
                  <p className="text-slate-400 mt-1 uppercase text-xs tracking-widest font-mono">Manage available deployment sectors</p>
                </div>
                <button
                  onClick={() => { resetForm(); setShowModal(true); }}
                  className="bg-primary text-background-dark px-6 py-3 rounded-xl font-bold shadow-neon hover:scale-105 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">add_box</span>
                  ADD NEW GAME
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {games.map(game => (
                  <div key={game.id} className="glass-panel rounded-2xl overflow-hidden border border-dark group hover:border-primary/30 transition-all flex flex-col">
                    <div className="h-40 relative">
                      <img
                        src={game.image}
                        className="w-full h-full object-cover"
                        alt={game.name}
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <p className="text-[10px] text-primary font-mono uppercase tracking-widest mb-1">{game.category}</p>
                        <h3 className="font-bold">{game.name}</h3>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col gap-4">
                      <p className="text-xs text-slate-400 line-clamp-2">{game.description}</p>
                      <div className="mt-auto pt-4 border-t border-dark flex gap-2">
                        <button onClick={() => handleEdit(game)} className="flex-1 bg-surface-dark border border-dark p-2 rounded-lg text-xs font-bold hover:bg-white/10 transition-all">EDIT</button>
                        <button onClick={() => handleManageItems(game)} className="flex-1 bg-primary/10 border border-primary/20 p-2 rounded-lg text-xs font-bold text-primary hover:bg-primary hover:text-black transition-all">ITEMS</button>
                        <button onClick={() => handleDelete(game.id)} className="p-2 border border-red-500/20 rounded-lg text-red-500 hover:bg-red-500 hover:text-main transition-all">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight uppercase">Master Ledger</h1>
                  <p className="text-slate-400 mt-1 uppercase text-xs tracking-widest font-mono">Full signal transmission history</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-sm">search</span>
                    <input type="text" placeholder="Filter ID/Alias..." className="bg-surface-dark border border-dark rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-primary w-48" />
                  </div>
                  <button className="bg-surface-dark border border-dark px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/5">EXPORT CSV</button>
                </div>
              </div>

              <div className="glass-panel rounded-2xl overflow-hidden border border-dark">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-accent text-slate-500 text-[10px] uppercase tracking-widest border-b border-dark">
                      <th className="p-5 font-bold">Signal ID</th>
                      <th className="p-5 font-bold">Module</th>
                      <th className="p-5 font-bold">Alias</th>
                      <th className="p-5 font-bold">Payload</th>
                      <th className="p-5 font-bold">Status</th>
                      <th className="p-5 font-bold">Timestamp</th>
                      <th className="p-5 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {txns.length === 0 ? (
                      <tr><td colSpan={6} className="p-20 text-center text-slate-600 font-mono text-xs italic tracking-widest">No transmissions recorded in local node memory...</td></tr>
                    ) : (
                      txns.map(t => (
                        <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                          <td className="p-5 font-mono text-slate-400 group-hover:text-primary transition-colors">
                            <Link to={`/transaction/${t.id}`} className="hover:underline">{t.id}</Link>
                          </td>
                          <td className="p-5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{t.gameName}</span>
                            </div>
                          </td>
                          <td className="p-5 font-mono text-primary/80">{t.userId}</td>
                          <td className="p-5">
                            <div className="flex flex-col">
                              <span className="font-bold">{t.item}</span>
                              <span className="text-[10px] text-slate-500">{t.amount}</span>
                            </div>
                          </td>
                          <td className="p-5">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${t.status === 'Success' ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]' :
                              'bg-red-500/10 text-red-400 border border-red-500/20'
                              }`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="p-5 text-slate-500 font-mono text-[10px]">{new Date(t.timestamp).toLocaleString()}</td>
                          <td className="p-5">
                            <button
                              onClick={async () => {
                                if (window.confirm(`Delete Transaction ${t.id}?`)) {
                                  try {
                                    await fetch(`${API_URL}/transactions/${t.id}`, { method: 'DELETE' });
                                    fetchData();
                                  } catch (error) {
                                    console.error("Failed to delete transaction", error);
                                  }
                                }
                              }}
                              className="text-red-500 hover:text-main transition-opacity opacity-0 group-hover:opacity-100"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight uppercase">System Logs</h1>
                  <p className="text-slate-400 mt-1 uppercase text-xs tracking-widest font-mono">Detailed audit trail of all system activities</p>
                </div>
                <button
                  onClick={async () => {
                    if (window.confirm("Clear ALL logs? This cannot be undone.")) {
                      await fetch(`${API_URL}/logs`, { method: 'DELETE' });
                      fetchData();
                    }
                  }}
                  className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-3 rounded-xl font-bold hover:bg-red-500 hover:text-main transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">delete_forever</span>
                  CLEAR LOGS
                </button>
              </div>

              <div className="glass-panel rounded-2xl overflow-hidden border border-dark">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-accent text-slate-500 text-[10px] uppercase tracking-widest border-b border-dark">
                      <th className="p-5 font-bold">ID</th>
                      <th className="p-5 font-bold">Timestamp</th>
                      <th className="p-5 font-bold">User</th>
                      <th className="p-5 font-bold">Action</th>
                      <th className="p-5 font-bold">Details</th>
                      <th className="p-5 font-bold">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {logs.length === 0 ? (
                      <tr><td colSpan={6} className="p-20 text-center text-slate-600 font-mono text-xs italic tracking-widest">No logs recorded...</td></tr>
                    ) : (
                      logs.map(log => (
                        <tr key={log.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-5 font-mono text-slate-500">#{log.id}</td>
                          <td className="p-5 font-mono text-slate-400 text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                          <td className="p-5">
                            <span className="font-bold text-main">{log.username}</span>
                            {log.userId && <span className="text-[10px] text-slate-500 block">ID: {log.userId}</span>}
                          </td>
                          <td className="p-5">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${log.action.includes('FAILED') || log.action.includes('error') ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                              log.action.includes('LOGIN') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                log.action.includes('TRANSACTION') ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                  'bg-slate-500/10 text-slate-400 border border-dark'
                              }`}>
                              {log.action}
                            </span>
                          </td>
                          <td className="p-5 font-mono text-xs text-slate-300 max-w-md break-words">
                            {log.details}
                          </td>
                          <td className="p-5 font-mono text-xs text-slate-500">{log.ip || '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'vouchers' && (
            <VoucherManager vouchers={vouchers} games={games} onUpdate={fetchData} />
          )}

          {activeTab === 'banners' && (
            <BannerManager banners={banners} onUpdate={fetchData} />
          )}</main>
      </div>

      {/* Add/Edit Game Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-8 border border-dark shadow-neon relative animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold uppercase tracking-tighter">{isEditing ? 'Sector Maintenance' : 'Initialize New Sector'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-main transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveGame} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Game Module ID</label>
                  <input
                    type="text"
                    required
                    disabled={isEditing}
                    value={currentGame.id}
                    onChange={(e) => setCurrentGame({ ...currentGame, id: e.target.value })}
                    className="w-full bg-surface-accent border border-dark rounded-xl px-4 py-3 text-sm text-main focus:outline-none focus:border-primary font-mono"
                    placeholder="e.g. mobile-legends"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Display Name</label>
                  <input
                    type="text"
                    required
                    value={currentGame.name}
                    onChange={(e) => setCurrentGame({ ...currentGame, name: e.target.value })}
                    className="w-full bg-surface-accent border border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. Mobile Legends"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</label>
                  <select
                    value={currentGame.category}
                    onChange={(e) => setCurrentGame({ ...currentGame, category: e.target.value })}
                    className="w-full bg-surface-accent border border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary appearance-none"
                  >
                    <option value="RPG">RPG</option>
                    <option value="Shooter">Shooter</option>
                    <option value="MOBA">MOBA</option>
                    <option value="Battle Royale">Battle Royale</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Visual Link (URL)</label>
                  <input
                    type="text"
                    required
                    value={currentGame.image}
                    onChange={(e) => setCurrentGame({ ...currentGame, image: e.target.value })}
                    className="w-full bg-surface-accent border border-dark rounded-xl px-4 py-3 text-sm text-main focus:outline-none focus:border-primary font-mono"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Brand / Provider Code (APIGames)</label>
                <input
                  type="text"
                  value={currentGame.brand || ''}
                  onChange={(e) => setCurrentGame({ ...currentGame, brand: e.target.value })}
                  className="w-full bg-surface-accent border border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary font-mono text-primary"
                  placeholder="e.g. mobilelegend (Wajib untuk Top Up)"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sector Description</label>
                <textarea
                  value={currentGame.description}
                  onChange={(e) => setCurrentGame({ ...currentGame, description: e.target.value })}
                  className="w-full bg-surface-accent border border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary h-24 resize-none"
                  placeholder="Enter operational parameters..."
                ></textarea>
              </div>

              <div className="flex gap-8">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={currentGame.isHot}
                    onChange={(e) => setCurrentGame({ ...currentGame, isHot: e.target.checked })}
                    className="size-5 bg-background-dark border border-dark rounded accent-primary"
                  />
                  <span className="text-xs font-bold uppercase tracking-widest group-hover:text-primary transition-colors">Trending Status</span>
                </label>
                <div className="flex-1 flex items-center gap-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Promo Tag:</label>
                  <input
                    type="text"
                    value={currentGame.discount}
                    onChange={(e) => setCurrentGame({ ...currentGame, discount: e.target.value })}
                    className="flex-1 bg-surface-accent border border-dark rounded-lg px-3 py-1 text-[10px] focus:outline-none focus:border-primary font-mono"
                    placeholder="-15% (Optional)"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-surface-dark py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-white/5 transition-all">ABORT</button>
                <button type="submit" className="flex-[2] bg-primary text-background-dark py-4 rounded-xl font-bold uppercase text-xs tracking-widest shadow-neon hover:scale-[1.02] transition-all">COMMIT CHANGES</button>
              </div>
            </form>
          </div>
        </div>
      )
      }

      {/* Item Management Modal */}
      {
        showItemModal && selectedGameForItems && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-background-dark/90 backdrop-blur-sm" onClick={() => setShowItemModal(false)}></div>
            <div className="glass-panel w-full max-w-4xl rounded-3xl p-8 border border-dark shadow-neon relative animate-in zoom-in-95 flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold uppercase tracking-tighter">Manage Items</h2>
                  <p className="text-slate-400 text-xs font-mono tracking-widest uppercase">Sector: {selectedGameForItems.name}</p>
                </div>
                <button onClick={() => setShowItemModal(false)} className="text-slate-400 hover:text-main transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto mb-8 pr-2">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-dark text-xs uppercase tracking-widest text-slate-500">
                      <th className="p-4">Name</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Provider Code</th>
                      <th className="p-4">Bonus</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item: any) => (
                      <tr key={item.id} className="border-b border-dark hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold">{item.name}</td>
                        <td className="p-4 font-mono text-primary">Rp {item.price.toLocaleString()}</td>
                        <td className="p-4 font-mono text-slate-400">{item.code}</td>
                        <td className="p-4 text-xs text-secondary">{item.bonus}</td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => setNewItem({ ...item })}
                            className="text-primary hover:text-main transition-colors"
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-main transition-colors">
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-surface-dark p-6 rounded-2xl border border-dark">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4">{newItem.id ? 'Edit Item' : 'Add New Item'}</h3>
                <form onSubmit={handleAddItem} className="grid grid-cols-5 gap-4 items-end">
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Item Name</label>
                    <input
                      required
                      value={newItem.name}
                      onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                      className="w-full bg-background-dark border border-dark rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      placeholder="e.g. 10 Diamonds"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Price</label>
                    <input
                      type="number"
                      required
                      value={newItem.price || ''}
                      onChange={e => setNewItem({ ...newItem, price: parseInt(e.target.value) })}
                      className="w-full bg-background-dark border border-dark rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Product Code / SKU</label>
                    <input
                      required
                      value={newItem.code}
                      onChange={e => setNewItem({ ...newItem, code: e.target.value })}
                      className="w-full bg-background-dark border border-dark rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none font-mono"
                      placeholder="PROV-CODE"
                    />
                  </div>
                  <button type="submit" className="bg-primary text-background-dark font-bold py-2 rounded-lg hover:scale-105 transition-all shadow-neon">
                    {newItem.id ? 'UPDATE' : 'ADD'}
                  </button>
                  {newItem.id && (
                    <button
                      type="button"
                      onClick={() => setNewItem({ name: '', price: 0, code: '', bonus: '' })}
                      className="bg-red-500/10 text-red-500 border border-red-500/20 font-bold py-2 rounded-lg hover:bg-red-500 hover:text-main transition-all ml-2"
                    >
                      CANCEL
                    </button>
                  )}
                  <div className="col-span-5 pt-2">
                    <input
                      value={newItem.bonus}
                      onChange={e => setNewItem({ ...newItem, bonus: e.target.value })}
                      className="w-full bg-background-dark border border-dark rounded-lg px-3 py-2 text-xs focus:border-primary focus:outline-none"
                      placeholder="Bonus Label (Optional)"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

// Sub-component for Voucher Management to keep main file clean
const VoucherManager: React.FC<{ games: Game[] }> = ({ games }) => {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [newVoucher, setNewVoucher] = useState({ code: '', discountPercent: 10, maxUsage: 100, gameId: '', expiresAt: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      const data = await db.getVouchers();
      setVouchers(data || []);
    } catch (e) { console.error(e); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await db.createVoucher({
        ...newVoucher,
        gameId: newVoucher.gameId || null,
        expiresAt: newVoucher.expiresAt || null
      });
      loadVouchers();
      setNewVoucher({ code: '', discountPercent: 10, maxUsage: 100, gameId: '', expiresAt: '' });
    } catch (e) { alert("Failed to create voucher"); }
    setIsLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete voucher?")) {
      await db.deleteVoucher(id);
      loadVouchers();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight uppercase">Voucher Center</h1>
          <p className="text-slate-400 mt-1 uppercase text-xs tracking-widest font-mono">Manage discount codes and promo campaigns</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-2xl border border-dark sticky top-24">
            <h2 className="font-bold text-lg mb-6 uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">add_card</span>
              Create Voucher
            </h2>
            <form onSubmit={handleCreate} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Voucher Code</label>
                <input
                  required
                  value={newVoucher.code}
                  onChange={e => setNewVoucher({ ...newVoucher, code: e.target.value.toUpperCase() })}
                  className="w-full bg-surface-dark border border-dark rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none font-mono uppercase tracking-wider"
                  placeholder="e.g. SAVE50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Discount (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      max="100"
                      value={newVoucher.discountPercent}
                      onChange={e => setNewVoucher({ ...newVoucher, discountPercent: parseInt(e.target.value) })}
                      className="w-full bg-surface-dark border border-dark rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Max Usage</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newVoucher.maxUsage}
                    onChange={e => setNewVoucher({ ...newVoucher, maxUsage: parseInt(e.target.value) })}
                    className="w-full bg-surface-dark border border-dark rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Target Game (Optional)</label>
                <select
                  value={newVoucher.gameId}
                  onChange={e => setNewVoucher({ ...newVoucher, gameId: e.target.value })}
                  className="w-full bg-surface-dark border border-dark rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none appearance-none"
                >
                  <option value="">All Games</option>
                  {games.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Expires At (Optional)</label>
                <input
                  type="date"
                  value={newVoucher.expiresAt}
                  onChange={e => setNewVoucher({ ...newVoucher, expiresAt: e.target.value })}
                  className="w-full bg-surface-dark border border-dark rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none text-slate-400"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-secondary text-background-dark py-4 rounded-xl font-bold uppercase tracking-widest shadow-neon hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 mt-4"
              >
                {isLoading ? 'Processing...' : 'Generate Code'}
              </button>
            </form>
          </div>
        </div>

        {/* Voucher List */}
        <div className="lg:col-span-2">
          <div className="glass-panel rounded-2xl overflow-hidden border border-dark">
            <div className="p-6 border-b border-dark bg-surface-accent/30 flex justify-between items-center">
              <h3 className="font-bold text-sm uppercase tracking-widest">Active Campaigns</h3>
              <span className="text-[10px] font-mono text-slate-500">{vouchers.length} Active</span>
            </div>

            {vouchers.length === 0 ? (
              <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-4">
                <span className="material-symbols-outlined text-4xl opacity-20">confirmation_number</span>
                <p className="text-xs font-mono uppercase tracking-widest">No active vouchers deployed</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {vouchers.map(v => (
                  <div key={v.id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-col shrink-0">
                        <span className="text-lg font-bold text-primary">{v.discountPercent}%</span>
                        <span className="text-[8px] uppercase font-bold text-primary/70">OFF</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold font-mono text-lg tracking-wide text-white">{v.code}</h4>
                          {!v.gameId ? (
                            <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-[9px] font-bold uppercase border border-secondary/20">Global</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[9px] font-bold uppercase border border-purple-500/20">
                              {games.find(g => g.id == v.gameId)?.name || 'Game'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">group</span>
                            {v.currentUsage} / {v.maxUsage} Used
                          </span>
                          {v.expiresAt && (
                            <span className={`flex items-center gap-1 ${new Date(v.expiresAt) < new Date() ? 'text-red-400' : ''}`}>
                              <span className="material-symbols-outlined text-[12px]">event</span>
                              {new Date(v.expiresAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(v.id)}
                      className="size-8 rounded-lg border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                      title="Delete Voucher"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const StatCard: React.FC<{ label: string; value: any; icon: string; color: string; trend: string }> = ({ label, value, icon, color, trend }) => (
  <div className="glass-panel p-6 rounded-2xl border border-dark hover:border-white/20 transition-all flex flex-col gap-4 group">
    <div className="flex justify-between items-start">
      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">{label}</p>
      <span className={`material-symbols-outlined text-${color} text-[20px] group-hover:scale-110 transition-transform`}>{icon}</span>
    </div>
    <div className="flex items-end gap-2">
      <h3 className="text-2xl font-bold font-display">{value}</h3>
      <span className="text-green-400 text-[10px] font-bold mb-1">{trend}</span>
    </div>
    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full bg-${color} w-3/4 shadow-[0_0_10px_rgba(37,192,244,0.5)]`}></div>
    </div>
  </div>
);
