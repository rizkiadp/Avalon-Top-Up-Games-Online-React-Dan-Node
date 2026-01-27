
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/dbService';
import { Denomination, PaymentMethod, Transaction } from '../types';

export const GameDetail: React.FC = () => {

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<any>(null);
  const user = db.getCurrentUser();

  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [nickname, setNickname] = useState(''); // New State
  const [isChecking, setIsChecking] = useState(false);
  const [selectedDenom, setSelectedDenom] = useState<Denomination | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      db.getGameById(id).then(setGame).catch(() => setGame(null));
    }
  }, [id]);

  if (!game) return <div className="pt-32 text-center text-white">Loading Game Data...</div>;

  const handlePurchase = async () => {
    if (!user) {
      alert("Unauthorized Access. Please login to continue.");
      navigate('/login');
      return;
    }

    if (!userId || !selectedDenom || !selectedPayment) {
      alert("Harap lengkapi semua data (ID, Nominal, dan Pembayaran)!");
      return;
    }

    setIsProcessing(true);

    try {
      const newTxn = {
        gameId: game.id,
        gameName: game.name,
        item: selectedDenom.amount,
        amount: `Rp ${selectedDenom.price.toLocaleString()}`,
        price: selectedDenom.price,
        userId: user.id,
        userGameId: zoneId ? `${userId} (${zoneId})` : userId,
      };

      const result = await db.addTransaction(newTxn);

      if (result.payment && result.payment.redirect_url) {
        // Redirect to Midtrans
        window.location.href = result.payment.redirect_url;
      } else {
        navigate(`/success/${result.id}`);
      }
    } catch (error) {
      alert("Transaction Failed. Check console.");
      console.error(error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-32 lg:pb-12 px-6 max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
      {/* Sidebar Info */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-panel p-6 rounded-2xl sticky top-24 z-10">
          <img
            src={game.image}
            className="w-full aspect-[3/4] object-cover rounded-xl mb-6 shadow-neon"
            alt={game.name}
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x800?text=No+Image'; }}
          />
          <h1 className="text-3xl font-bold mb-2">{game.name}</h1>
          <p className="text-slate-400 text-sm mb-4 leading-relaxed">{game.description}</p>
          <div className="flex items-center gap-2 text-primary font-bold">
            <span className="material-symbols-outlined">verified</span>
            <span>OFFICIAL PARTNER</span>
          </div>
        </div>
      </div>

      {/* Main Flow */}
      <div className="lg:col-span-2 space-y-8">
        {!user && (
          <div className="bg-secondary/10 border border-secondary/30 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">info</span>
              <p className="text-sm">Silakan login untuk melacak pesanan Anda.</p>
            </div>
            <button onClick={() => navigate('/login')} className="bg-secondary px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap">LOGIN</button>
          </div>
        )}

        {/* Step 1: User ID */}
        <section className="glass-panel p-8 rounded-2xl border-l-4 border-primary shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="size-10 rounded-full bg-primary text-background-dark flex items-center justify-center font-bold">1</div>
            <h2 className="text-xl font-bold uppercase tracking-wider">Data Akun</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">User ID</label>
                {nickname && <span className="text-xs font-bold text-green-400">✅ {nickname}</span>}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Masukkan ID"
                  className="w-full bg-background-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-all"
                />
                <button
                  onClick={async () => {
                    if (!userId) return;
                    setIsChecking(true);
                    try {
                      const res = await fetch('/api/games/check', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ gameId: game.id, userId, zoneId })
                      });
                      const data = await res.json();
                      if (data.isValid) setNickname(data.username);
                      else alert("ID Tidak Ditemukan!");
                    } catch (e) { console.error(e); }
                    setIsChecking(false);
                  }}
                  className="bg-primary/20 hover:bg-primary/40 text-primary border border-primary/50 px-4 rounded-xl font-bold whitespace-nowrap"
                >
                  {isChecking ? '...' : 'CEK'}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Zone ID</label>
              <input
                type="text"
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                placeholder="1234"
                className="w-full bg-background-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* Step 2: Nominal */}
        <section className="glass-panel p-8 rounded-2xl border-l-4 border-primary shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="size-10 rounded-full bg-primary text-background-dark flex items-center justify-center font-bold">2</div>
            <h2 className="text-xl font-bold uppercase tracking-wider">Nominal Top Up</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {game.items && game.items.length > 0 ? (
              game.items.map((item: any) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedDenom({ id: item.id.toString(), amount: item.name, price: item.price, bonus: item.bonus })}
                  className={`p-4 rounded-xl border transition-all text-left relative group ${selectedDenom?.amount === item.name
                    ? 'bg-primary/20 border-primary shadow-neon ring-1 ring-primary/50'
                    : 'bg-surface-dark border-white/10 hover:border-primary/50'
                    }`}
                >
                  <p className="font-bold text-lg mb-1">{item.name}</p>
                  <p className="text-primary text-xs font-mono">Rp {item.price.toLocaleString()}</p>
                  {item.bonus && <span className="absolute -top-2 -right-2 bg-secondary text-white text-[8px] px-2 py-1 rounded-full font-bold shadow-lg animate-bounce">{item.bonus}</span>}
                </button>
              ))
            ) : (
              <div className="col-span-3 text-center text-slate-500 py-8">
                No items available for this game configuration.
              </div>
            )}
          </div>
        </section>

        {/* Step 3: Payment */}
        <section className="glass-panel p-8 rounded-2xl border-l-4 border-primary shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="size-10 rounded-full bg-primary text-background-dark flex items-center justify-center font-bold">3</div>
            <h2 className="text-xl font-bold uppercase tracking-wider">Pembayaran</h2>
          </div>
          <div className="space-y-6">
            {['Automatic'].map((group) => (
              <div key={group}>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{group}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {db.getPaymentMethods().filter(p => p.group === group).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPayment(p)}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${selectedPayment?.id === p.id
                        ? 'bg-primary/20 border-primary ring-1 ring-primary/50'
                        : 'bg-surface-dark border-white/5 hover:bg-white/5'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">{p.icon}</span>
                        <span className="font-medium text-sm">{p.name}</span>
                      </div>
                      <span className="material-symbols-outlined text-[20px] text-slate-600">
                        {selectedPayment?.id === p.id ? 'check_circle' : 'circle'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Step 4: Checkout Desktop View */}
        <section className="hidden lg:block glass-panel p-8 rounded-2xl border-l-4 border-secondary overflow-hidden relative shadow-neon">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
            <div>
              <p className="text-slate-400 text-sm">Total Pembayaran</p>
              <h3 className="text-3xl font-bold text-primary">
                {selectedDenom ? `Rp ${selectedDenom.price.toLocaleString()}` : 'Rp 0'}
              </h3>
            </div>
            <button
              onClick={handlePurchase}
              disabled={isProcessing}
              className={`w-full sm:w-auto bg-gradient-to-r from-primary to-secondary text-background-dark px-12 py-4 rounded-xl font-bold text-lg shadow-neon hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 ${selectedDenom && selectedPayment ? 'animate-pulse' : ''}`}
            >
              {isProcessing ? (
                <>
                  <span className="size-5 border-2 border-background-dark border-t-transparent rounded-full animate-spin"></span>
                  PROSES...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined font-bold">payments</span>
                  BELI SEKARANG
                </>
              )}
            </button>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full"></div>
        </section>
      </div>

      {/* Sticky Bottom Bar for Mobile Visibility */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[50] glass-panel border-t border-white/10 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex items-center justify-between gap-4 animate-in slide-in-from-bottom-full">
        <div className="flex flex-col">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Harga</p>
          <p className="text-xl font-bold text-primary">
            {selectedDenom ? `Rp ${selectedDenom.price.toLocaleString()}` : 'Rp 0'}
          </p>
        </div>
        <button
          onClick={handlePurchase}
          disabled={isProcessing}
          className={`flex-1 bg-gradient-to-r from-primary to-secondary text-background-dark py-3 rounded-xl font-bold text-sm shadow-neon flex items-center justify-center gap-2 active:scale-95 transition-all ${selectedDenom && selectedPayment && !isProcessing ? 'ring-2 ring-white/50 animate-pulse' : 'opacity-50'}`}
        >
          {isProcessing ? (
            <span className="size-4 border-2 border-background-dark border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <span className="material-symbols-outlined text-lg">shopping_cart</span>
          )}
          {isProcessing ? 'PROSES...' : 'BELI'}
        </button>
      </div>
    </div>
  );
};
