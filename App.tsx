
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { AdminDashboard } from './pages/Admin';
import { GameDetail } from './pages/GameDetail';
import { TransactionDetail } from './pages/TransactionDetail';
import { History } from './pages/History';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Success } from './pages/Success';
import { AIChat } from './components/AIChat';
import { db } from './services/dbService';
import { ThemeToggle } from './components/ThemeToggle';
import { Profile } from './pages/Profile';
import { InfoPage } from './pages/InfoPage';

const Navbar: React.FC = () => {
  const user = db.getCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith('/admin');
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handleLogout = () => {
    db.logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b border-dark h-20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="size-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-background-dark shadow-neon group-hover:rotate-12 transition-transform">
              <span className="material-symbols-outlined font-bold">sports_esports</span>
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase">AVALON<span className="text-primary">GAMES</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest">
            <Link to="/" className={`${location.pathname === '/' ? 'text-primary' : 'text-main'} hover:text-primary transition-colors uppercase`}>Home</Link>
            <Link to="/history" className={`${location.pathname === '/history' ? 'text-primary' : 'text-main'} hover:text-primary transition-colors uppercase`}>Riwayat</Link>
            {user?.role === 'Admin' && (
              <Link to="/admin" className={`${isAdmin ? 'text-primary' : 'text-main'} hover:text-primary transition-colors uppercase`}>Admin</Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <div className="hidden md:flex items-center gap-6">
              {/* Credits Display Removed */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-surface-dark border border-dark hover:border-primary/30 transition-all cursor-pointer"
                >
                  <img src={user.avatar} className="size-8 rounded-full border border-dark" alt="Avatar" />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold leading-none">{user.username}</p>
                    <p className="text-[9px] text-primary mt-1 font-mono uppercase tracking-widest">{user.vipLevel}</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 text-sm">{isDropdownOpen ? 'expand_less' : 'expand_more'}</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 w-full">
                    <div className="glass-panel p-2 rounded-xl w-full border border-dark shadow-2xl flex flex-col gap-1">
                      <Link
                        to="/profile"
                        className="w-full text-left px-4 py-3 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-3 transition-colors"
                      >
                        <span className="material-symbols-outlined text-primary text-sm">person_edit</span>
                        UBAH DATA
                      </Link>
                      <div className="h-px bg-white/5 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-3 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        LOGOUT
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex bg-primary text-background-dark px-6 py-2 rounded-xl font-bold text-xs shadow-neon hover:scale-105 transition-all items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm font-bold">login</span> LOGIN SYSTEM
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Reusing dropdown state for simpler toggle or create new state
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {
        isDropdownOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-surface-dark/95 backdrop-blur-xl pt-24 px-6 animate-in slide-in-from-right-10 duration-200">
            <button
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white"
              onClick={() => setIsDropdownOpen(false)}
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>

            <div className="flex flex-col gap-6 text-center">
              <Link to="/" onClick={() => setIsDropdownOpen(false)} className="text-xl font-bold tracking-widest text-white hover:text-primary uppercase py-4 border-b border-white/5">Home</Link>
              <Link to="/history" onClick={() => setIsDropdownOpen(false)} className="text-xl font-bold tracking-widest text-white hover:text-primary uppercase py-4 border-b border-white/5">Riwayat</Link>
              {user?.role === 'Admin' && (
                <Link to="/admin" onClick={() => setIsDropdownOpen(false)} className="text-xl font-bold tracking-widest text-primary hover:text-white uppercase py-4 border-b border-white/5">Admin</Link>
              )}

              {user ? (
                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex items-center justify-center gap-3">
                    <img src={user.avatar} className="size-10 rounded-full border border-primary" alt="Profile" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">{user.username}</p>
                      <p className="text-xs text-primary font-mono">{user.vipLevel}</p>
                    </div>
                  </div>
                  <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="bg-surface-accent py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">person_edit</span> Ubah Data
                  </Link>
                  <button onClick={() => { handleLogout(); setIsDropdownOpen(false); }} className="bg-red-500/10 text-red-400 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">logout</span> Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setIsDropdownOpen(false)} className="bg-primary text-background-dark py-4 rounded-xl font-bold uppercase shadow-neon mt-4">Login System</Link>
              )}
            </div>
          </div>
        )
      }
    </nav >
  );
};

const Footer: React.FC = () => (
  <footer className="py-12 px-6 border-t border-dark bg-surface-dark relative z-10">
    <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 mb-10">
      <div className="col-span-1 md:col-span-2 space-y-5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">sports_esports</span>
          <span className="text-2xl font-bold tracking-tighter">AVALON<span className="text-primary">GAMES</span></span>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-body">
          Platform top-up game paling aman dan terpercaya di ekosistem digital.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="font-bold text-sm tracking-widest uppercase text-main">Menu Utama</h4>
        <Link to="/" className="text-slate-500 hover:text-primary text-sm transition-colors">Semua Game</Link>
        <Link to="/history" className="text-slate-500 hover:text-primary text-sm transition-colors">Cek Pesanan</Link>
        <Link to="/about" className="text-slate-500 hover:text-primary text-sm transition-colors">Tentang Kami</Link>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="font-bold text-sm tracking-widest uppercase text-main">Bantuan</h4>
        <Link to="/help" className="text-slate-500 hover:text-primary text-sm transition-colors">Pusat Bantuan</Link>
        <Link to="/terms" className="text-slate-500 hover:text-primary text-sm transition-colors">Ketentuan Layanan</Link>
        <Link to="/privacy" className="text-slate-500 hover:text-primary text-sm transition-colors">Kebijakan Privasi</Link>
      </div>
    </div>
    <div className="max-w-7xl mx-auto border-t border-dark pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-600 font-mono tracking-widest">
      <p>© 2024 AVALON GAMES ECOSYSTEM.</p>
      <div className="flex items-center gap-4 mt-2 md:mt-0">
        <span>EST. 2023</span>
        <span>SECURE</span>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  useEffect(() => {
    // Track Daily Visit
    const trackVisit = async () => {
      const visited = sessionStorage.getItem('avalon_visited');
      if (!visited) {
        try {
          await fetch('http://localhost:5000/api/analytics/visit', { method: 'POST' });
          sessionStorage.setItem('avalon_visited', 'true');
        } catch (e) {
          console.error("Failed to track visit", e);
        }
      }
    };
    trackVisit();
  }, []);

  return (
    <Router>
      <Navbar />
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/game/:id" element={<GameDetail />} />
          <Route path="/history" element={<History />} />
          <Route path="/transaction/:id" element={<TransactionDetail />} />
          <Route path="/success/:id" element={<Success />} />
          <Route path="/about" element={<InfoPage />} />
          <Route path="/help" element={<InfoPage />} />
          <Route path="/terms" element={<InfoPage />} />
          <Route path="/privacy" element={<InfoPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
      <Footer />
      <AIChat />
    </Router>
  );
};

export default App;
