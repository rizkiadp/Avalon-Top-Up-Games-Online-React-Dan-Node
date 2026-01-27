
import React, { useState, useEffect } from 'react';
import { db } from '../services/dbService';
import { useNavigate } from 'react-router-dom';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    db.getGames().then(setGames).catch(console.error);
  }, []);

  const categories = ['All', 'RPG', 'Shooter', 'MOBA', 'Battle Royale'];

  const filteredGames = games.filter(g =>
    (activeCategory === 'All' || g.category === activeCategory) &&
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col pt-20 cyber-grid">
      {/* Hero */}
      <section className="relative px-6 py-16 md:py-24 max-w-7xl mx-auto w-full grid lg:grid-cols-2 items-center gap-12">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-dark border border-white/10 w-fit">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Instant Delivery System Online</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
            Top Up Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary neon-glow">Gaming Experience</span><br />
            Instantly
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-xl font-body leading-relaxed">
            Akses premium currency untuk semua judul favoritmu. Aman, cepat, dan terpercaya dengan teknologi enkripsi terbaru.
          </p>
          <div className="flex gap-4 pt-4">
            <button className="bg-primary text-background-dark px-8 py-4 rounded-xl font-bold tracking-wide shadow-neon hover:scale-105 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined">bolt</span> MULAI BELANJA
            </button>
            <button className="bg-surface-dark border border-white/10 px-8 py-4 rounded-xl font-bold hover:bg-white/5 transition-all">
              PROMO TERKINI
            </button>
          </div>
        </div>

        <div className="hidden lg:block relative group">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-50 animate-pulse"></div>
          <div className="relative glass-panel rounded-2xl p-4 shadow-2xl overflow-hidden aspect-[4/3] rotate-1 group-hover:rotate-0 transition-transform duration-700">
            <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover rounded-xl" alt="Gaming" />
            <div className="absolute top-6 right-6 px-4 py-2 bg-secondary/80 backdrop-blur rounded-full border border-white/20 text-xs font-bold shadow-2xl">
              24/7 SUPPORT READY
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search */}
      <div className="sticky top-20 z-40 py-6 px-6 glass-panel border-y border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500">search</span>
            <input
              type="text"
              placeholder="Cari game favoritmu..."
              className="w-full bg-[#0b1215] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary transition-all font-body text-lg shadow-inner"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 p-1 bg-surface-dark rounded-2xl border border-white/5 overflow-x-auto w-full md:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeCategory === cat
                  ? 'bg-primary text-background-dark shadow-neon'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Game */}
      <section className="px-6 py-16 max-w-7xl mx-auto w-full">
        <h2 className="text-4xl font-bold tracking-tight mb-10">Katalog Game</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {filteredGames.map(game => (
            <div
              key={game.id}
              onClick={() => navigate(`/game/${game.id}`)}
              className="group relative glass-panel rounded-3xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all hover:-translate-y-3 hover:shadow-neon cursor-pointer"
            >
              <div className="aspect-[3/4] relative">
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                  {game.isHot && <span className="px-3 py-1 bg-secondary text-white text-[10px] font-bold rounded-full uppercase shadow-lg">Trending</span>}
                  {game.discount && <span className="px-3 py-1 bg-primary text-black text-[10px] font-bold rounded-full uppercase shadow-lg">{game.discount}</span>}
                </div>
                <img src={game.image} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt={game.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>

                {/* Overlay Button - Fixed visibility for Mobile */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 md:group-hover:opacity-100 transition-all duration-500 bg-primary/20 backdrop-blur-[2px]">
                  <div className="bg-white text-background-dark font-black py-3 px-8 rounded-full shadow-2xl translate-y-4 md:group-hover:translate-y-0 transition-transform">TOP UP</div>
                </div>
              </div>
              <div className="p-6 bg-surface-dark relative">
                <p className="text-[10px] text-primary font-mono uppercase tracking-[0.2em] mb-1">{game.category}</p>
                <h3 className="font-bold text-xl text-white truncate group-hover:text-primary transition-colors">{game.name}</h3>

                {/* Mobile visible button indicator */}
                <div className="md:hidden mt-4 bg-primary/10 border border-primary/30 text-primary text-center py-2 rounded-xl text-xs font-bold uppercase tracking-widest">
                  Top Up Sekarang
                </div>

                <div className="mt-4 hidden md:flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Instant</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-600 text-[18px]">arrow_forward</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
