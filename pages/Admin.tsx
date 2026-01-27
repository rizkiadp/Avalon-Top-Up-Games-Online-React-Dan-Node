
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Game, Transaction } from '../types';

const API_URL = 'http://localhost:5000/api';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'games' | 'transactions'>('overview');
  const [games, setGames] = useState<Game[]>([]);
  const [txns, setTxns] = useState<Transaction[]>([]);
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
  const [newItem, setNewItem] = useState({ name: '', price: 0, code: '', bonus: '' });

  const handleManageItems = (game: Game) => {
    setSelectedGameForItems(game);
    setCurrentItems(game.items || []);
    setShowItemModal(true);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGameForItems) return;
    try {
      const res = await fetch(`${API_URL}/games/${selectedGameForItems.id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      if (res.ok) {
        // Refresh Game Data to get updated items
        fetchData();
        // Optimistically update local list or re-fetch items specific content if needed
        // For simplicity, we'll re-fetch all games for now or just append local
        const savedItem = await res.json();
        setCurrentItems([...currentItems, savedItem]);
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
    try {
      // Fetch Games
      const gamesRes = await fetch(`${API_URL}/games`);
      const gamesData = await gamesRes.json();
      setGames(gamesData);

      // Fetch Transactions
      const txnsRes = await fetch(`${API_URL}/transactions`);
      const txnsData = await txnsRes.json();
      setTxns(txnsData);

      // Fetch Stats
      const statsRes = await fetch(`${API_URL}/transactions/stats`);
      const statsData = await statsRes.json();
      setStats(statsData);

    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
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
        <aside className="w-64 glass-panel border-r border-white/5 hidden md:flex flex-col p-6 gap-8">
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
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${activeTab === tab.id
                  ? 'bg-primary/20 text-primary border border-primary/30 shadow-neon'
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="bg-surface-dark p-4 rounded-xl border border-white/5 space-y-2">
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
                <div className="glass-panel p-6 rounded-2xl border border-white/10">
                  <h2 className="font-bold text-lg mb-6 uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">timeline</span>
                    Traffic Analysis
                  </h2>
                  <div className="h-64 flex items-end gap-2 px-4">
                    {[40, 70, 45, 90, 65, 80, 50, 95, 40, 60, 85, 70].map((h, i) => (
                      <div key={i} className="flex-1 bg-primary/20 hover:bg-primary transition-all rounded-t-lg group relative" style={{ height: `${h}%` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-dark px-2 py-1 rounded text-[8px] opacity-0 group-hover:opacity-100 transition-opacity border border-primary/30">
                          {h}k
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 text-[10px] text-slate-500 font-mono">
                    <span>00:00</span>
                    <span>12:00</span>
                    <span>23:59</span>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/10">
                  <h2 className="font-bold text-lg mb-6 uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">notifications</span>
                    System Logs
                  </h2>
                  <div className="space-y-4">
                    {[
                      { type: 'Info', msg: 'Backup cycle complete in sector-G', time: '2m ago' },
                      { type: 'Success', msg: 'Transaction TXN-4920 delivered', time: '5m ago' },
                      { type: 'Warning', msg: 'High latency detected in Bank-API', time: '12m ago' },
                      { type: 'Info', msg: 'Admin session authorized from 192.168.1.1', time: '1h ago' },
                    ].map((log, i) => (
                      <div key={i} className="flex items-center justify-between text-xs p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-3">
                          <span className={`font-mono font-bold uppercase ${log.type === 'Warning' ? 'text-orange-400' : 'text-primary'}`}>[{log.type}]</span>
                          <span className="text-slate-300">{log.msg}</span>
                        </div>
                        <span className="text-slate-500 font-mono text-[10px]">{log.time}</span>
                      </div>
                    ))}
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
                  <div key={game.id} className="glass-panel rounded-2xl overflow-hidden border border-white/5 group hover:border-primary/30 transition-all flex flex-col">
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
                      <div className="mt-auto pt-4 border-t border-white/5 flex gap-2">
                        <button onClick={() => handleEdit(game)} className="flex-1 bg-surface-dark border border-white/5 p-2 rounded-lg text-xs font-bold hover:bg-white/10 transition-all">EDIT</button>
                        <button onClick={() => handleManageItems(game)} className="flex-1 bg-primary/10 border border-primary/20 p-2 rounded-lg text-xs font-bold text-primary hover:bg-primary hover:text-black transition-all">ITEMS</button>
                        <button onClick={() => handleDelete(game.id)} className="p-2 border border-red-500/20 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all">
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
                    <input type="text" placeholder="Filter ID/Alias..." className="bg-surface-dark border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-primary w-48" />
                  </div>
                  <button className="bg-surface-dark border border-white/10 px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/5">EXPORT CSV</button>
                </div>
              </div>

              <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-background-dark/50 text-slate-500 text-[10px] uppercase tracking-widest border-b border-white/5">
                      <th className="p-5 font-bold">Signal ID</th>
                      <th className="p-5 font-bold">Module</th>
                      <th className="p-5 font-bold">Alias</th>
                      <th className="p-5 font-bold">Payload</th>
                      <th className="p-5 font-bold">Status</th>
                      <th className="p-5 font-bold">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {txns.length === 0 ? (
                      <tr><td colSpan={6} className="p-20 text-center text-slate-600 font-mono text-xs italic tracking-widest">No transmissions recorded in local node memory...</td></tr>
                    ) : (
                      txns.map(t => (
                        <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                          <td className="p-5 font-mono text-slate-400 group-hover:text-primary transition-colors">{t.id}</td>
                          <td className="p-5">
                            <div className="flex items-center gap-2">
                              {/* t.gameIcon might not actully exist on transaction object unless joined. For now UI used it. 
                                  Our DB model has gameName, but not gameIcon directly unless we include it. 
                                  Checking transaction.model.js: gameId, gameName. No gameIcon.
                                  We can fallback to a default or skip image. */}
                              {/* <img src={t.gameIcon} className="size-6 rounded object-cover border border-white/10" alt="" /> */}
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
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add/Edit Game Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-8 border border-white/10 shadow-neon relative animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold uppercase tracking-tighter">{isEditing ? 'Sector Maintenance' : 'Initialize New Sector'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors">
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
                    className="w-full bg-background-dark/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary font-mono"
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
                    className="w-full bg-background-dark/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
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
                    className="w-full bg-background-dark/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary appearance-none"
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
                    className="w-full bg-background-dark/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary font-mono"
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
                  className="w-full bg-background-dark/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary font-mono text-primary"
                  placeholder="e.g. mobilelegend (Wajib untuk Top Up)"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sector Description</label>
                <textarea
                  value={currentGame.description}
                  onChange={(e) => setCurrentGame({ ...currentGame, description: e.target.value })}
                  className="w-full bg-background-dark/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary h-24 resize-none"
                  placeholder="Enter operational parameters..."
                ></textarea>
              </div>

              <div className="flex gap-8">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={currentGame.isHot}
                    onChange={(e) => setCurrentGame({ ...currentGame, isHot: e.target.checked })}
                    className="size-5 bg-background-dark border border-white/10 rounded accent-primary"
                  />
                  <span className="text-xs font-bold uppercase tracking-widest group-hover:text-primary transition-colors">Trending Status</span>
                </label>
                <div className="flex-1 flex items-center gap-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Promo Tag:</label>
                  <input
                    type="text"
                    value={currentGame.discount}
                    onChange={(e) => setCurrentGame({ ...currentGame, discount: e.target.value })}
                    className="flex-1 bg-background-dark/50 border border-white/10 rounded-lg px-3 py-1 text-[10px] focus:outline-none focus:border-primary font-mono"
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
      )}

      {/* Item Management Modal */}
      {showItemModal && selectedGameForItems && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-background-dark/90 backdrop-blur-sm" onClick={() => setShowItemModal(false)}></div>
          <div className="glass-panel w-full max-w-4xl rounded-3xl p-8 border border-white/10 shadow-neon relative animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold uppercase tracking-tighter">Manage Items</h2>
                <p className="text-slate-400 text-xs font-mono tracking-widest uppercase">Sector: {selectedGameForItems.name}</p>
              </div>
              <button onClick={() => setShowItemModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mb-8 pr-2">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-slate-500">
                    <th className="p-4">Name</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Provider Code</th>
                    <th className="p-4">Bonus</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item: any) => (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold">{item.name}</td>
                      <td className="p-4 font-mono text-primary">Rp {item.price.toLocaleString()}</td>
                      <td className="p-4 font-mono text-slate-400">{item.code}</td>
                      <td className="p-4 text-xs text-secondary">{item.bonus}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-white transition-colors">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-surface-dark p-6 rounded-2xl border border-white/5">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Add New Item</h3>
              <form onSubmit={handleAddItem} className="grid grid-cols-5 gap-4 items-end">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Item Name</label>
                  <input
                    required
                    value={newItem.name}
                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full bg-background-dark border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
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
                    className="w-full bg-background-dark border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Product Code / SKU</label>
                  <input
                    required
                    value={newItem.code}
                    onChange={e => setNewItem({ ...newItem, code: e.target.value })}
                    className="w-full bg-background-dark border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none font-mono"
                    placeholder="PROV-CODE"
                  />
                </div>
                <button type="submit" className="bg-primary text-background-dark font-bold py-2 rounded-lg hover:scale-105 transition-all shadow-neon">ADD</button>
                <div className="col-span-5 pt-2">
                  <input
                    value={newItem.bonus}
                    onChange={e => setNewItem({ ...newItem, bonus: e.target.value })}
                    className="w-full bg-background-dark border border-white/10 rounded-lg px-3 py-2 text-xs focus:border-primary focus:outline-none"
                    placeholder="Bonus Label (Optional)"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: any; icon: string; color: string; trend: string }> = ({ label, value, icon, color, trend }) => (
  <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex flex-col gap-4 group">
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
