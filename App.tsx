
import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { AdminDashboard } from './pages/Admin';
import { GameDetail } from './pages/GameDetail';
import { History } from './pages/History';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Success } from './pages/Success';
import { AIChat } from './components/AIChat';
import { db } from './services/dbService';

const Navbar: React.FC = () => {
  const user = db.getCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    db.logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5 h-20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="size-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-background-dark shadow-neon group-hover:rotate-12 transition-transform">
              <span className="material-symbols-outlined font-bold">sports_esports</span>
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase">AVALON<span className="text-primary">GAMES</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest">
            <Link to="/" className={`${location.pathname === '/' ? 'text-primary' : 'text-slate-400'} hover:text-white transition-colors uppercase`}>Home</Link>
            <Link to="/history" className={`${location.pathname === '/history' ? 'text-primary' : 'text-slate-400'} hover:text-white transition-colors uppercase`}>Riwayat</Link>
            <Link to="/admin" className={`${isAdmin ? 'text-primary' : 'text-slate-400'} hover:text-white transition-colors uppercase`}>Admin</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">Available Credits</p>
                <p className="text-sm font-bold text-primary">Rp {user.credits.toLocaleString()}</p>
              </div>
              <div className="group relative">
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-surface-dark border border-white/5 hover:border-primary/30 transition-all cursor-pointer">
                  <img src={user.avatar} className="size-8 rounded-full border border-white/10" alt="Avatar" />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold leading-none">{user.username}</p>
                    <p className="text-[9px] text-primary mt-1 font-mono uppercase tracking-widest">{user.vipLevel}</p>
                  </div>
                </div>
                {/* Dropdown Logout */}
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="glass-panel p-2 rounded-xl min-w-[150px] border border-white/10 shadow-2xl">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-red-400 hover:bg-white/5 rounded-lg flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">logout</span> LOGOUT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-primary text-background-dark px-6 py-2 rounded-xl font-bold text-xs shadow-neon hover:scale-105 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm font-bold">login</span> LOGIN SYSTEM
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const Footer: React.FC = () => (
  <footer className="py-16 px-6 border-t border-white/5 bg-surface-dark relative z-10">
    <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
      <div className="col-span-1 md:col-span-2 space-y-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">sports_esports</span>
          <span className="text-2xl font-bold tracking-tighter">AVALON<span className="text-primary">GAMES</span></span>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-body">
          Platform top-up game paling aman dan terpercaya di ekosistem digital. Kami berkomitmen untuk memberikan pengalaman transaksi instan bagi gamer di seluruh dunia.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h4 className="font-bold text-sm tracking-widest uppercase text-white">Menu Utama</h4>
        <Link to="/" className="text-slate-500 hover:text-primary text-sm transition-colors">Semua Game</Link>
        <Link to="/history" className="text-slate-500 hover:text-primary text-sm transition-colors">Cek Pesanan</Link>
        <Link to="/" className="text-slate-500 hover:text-primary text-sm transition-colors">Tentang Kami</Link>
      </div>

      <div className="flex flex-col gap-4">
        <h4 className="font-bold text-sm tracking-widest uppercase text-white">Bantuan</h4>
        <Link to="/" className="text-slate-500 hover:text-primary text-sm transition-colors">Pusat Bantuan</Link>
        <Link to="/" className="text-slate-500 hover:text-primary text-sm transition-colors">Ketentuan Layanan</Link>
        <Link to="/" className="text-slate-500 hover:text-primary text-sm transition-colors">Kebijakan Privasi</Link>
      </div>
    </div>
    <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-600 font-mono tracking-widest">
      <p>© 2024 AVALON GAMES ECOSYSTEM. POWERED BY GEN-AI TECH.</p>
      <div className="flex items-center gap-6 mt-4 md:mt-0">
        <span>EST. 2023</span>
        <span>SECURITY: VERIFIED</span>
        <span>STATUS: OPERATIONAL</span>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/game/:id" element={<GameDetail />} />
          <Route path="/history" element={<History />} />
          <Route path="/success/:id" element={<Success />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
      <Footer />
      <AIChat />
    </Router>
  );
};

export default App;
