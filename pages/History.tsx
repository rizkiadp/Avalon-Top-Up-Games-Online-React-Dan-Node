import React, { useEffect, useState } from 'react';
import { db } from '../services/dbService';
import { Link } from 'react-router-dom';
import { Transaction } from '../types';

export const History: React.FC = () => {
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = db.getCurrentUser();

  useEffect(() => {
    if (user) {
      db.getTransactionsByUser(user.id)
        .then(data => {
          setTxns(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch history:", err);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-widest mb-1">
            <span>Terminal</span>
            <span>//</span>
            <span>User History</span>
          </div>
          <h1 className="text-4xl font-bold">MY TRANSACTIONS</h1>
          <p className="text-slate-400 mt-1">Lacak semua pesanan top-up Anda di sini.</p>
        </div>
        {user && (
          <div className="flex items-center gap-4 glass-panel px-6 py-3 rounded-2xl border border-white/10">
            {/* Credits Removed */}
            <button className="bg-primary/20 text-primary p-2 rounded-lg hover:bg-primary hover:text-black transition-all">
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-20 text-slate-500 animate-pulse">
            Loading Transaction History...
          </div>
        ) : txns.length === 0 ? (
          <div className="glass-panel p-20 rounded-3xl text-center border-dashed border-white/10">
            <span className="material-symbols-outlined text-6xl text-slate-700 mb-4">history</span>
            <p className="text-slate-400">Belum ada riwayat transaksi.</p>
            <Link to="/" className="text-primary mt-4 inline-block hover:underline">Mulai belanja sekarang →</Link>
          </div>
        ) : (
          txns.map(txn => (
            <div key={txn.id} className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 border border-white/5 hover:border-primary/30 transition-all group">
              <div className="size-16 rounded-xl overflow-hidden shadow-lg border border-white/10 shrink-0">
                <img src={txn.gameIcon} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg truncate">{txn.gameName}</h3>
                  <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-mono text-slate-500">{txn.id}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm font-body text-slate-400">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">token</span>
                    {txn.item}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">person</span>
                    {txn.userGameId}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                    {txn.date ? new Date(txn.date).toLocaleDateString() : ''}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xl font-bold mb-1">{txn.amount}</p>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${txn.status === 'Success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}>
                  {txn.status}
                </span>
              </div>
              <Link to={`/transaction/${txn.id}`} className="size-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-black transition-all">
                <span className="material-symbols-outlined">receipt_long</span>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
