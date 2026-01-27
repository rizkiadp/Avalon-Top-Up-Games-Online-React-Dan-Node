
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../services/dbService';
import { Transaction } from '../types';

export const Success: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [txn, setTxn] = useState<Transaction | null>(null);

  useEffect(() => {
    if (id) {
      db.getTransactionById(id).then(data => {
        if (data) setTxn(data);
        else {
          // Not found or error
          setTimeout(() => navigate('/'), 3000);
        }
      });
    }
  }, [id, navigate]);

  if (!txn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 animate-pulse">Loading Transaction Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-12 px-6 cyber-grid flex flex-col items-center">
      <div className="max-w-md w-full">
        {/* Success Icon */}
        <div className="flex flex-col items-center mb-8">
          <div className="size-24 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 shadow-[0_0_50px_rgba(34,197,94,0.3)] border border-green-500/30 mb-6 animate-bounce">
            <span className="material-symbols-outlined text-6xl">check_circle</span>
          </div>
          <h1 className="text-3xl font-bold text-center">TRANSACTION COMPLETE</h1>
          <p className="text-slate-400 text-sm mt-2 text-center uppercase tracking-widest font-mono">Signal Verified & Delivered</p>
        </div>

        {/* Receipt Panel */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="bg-surface-dark p-6 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={txn.gameIcon} className="size-10 rounded-lg object-cover" alt="" />
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">{txn.gameName}</p>
                <p className="font-bold text-primary">{txn.item}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 font-mono uppercase">Status</p>
              <p className="text-xs font-bold text-green-400">SUCCESS</p>
            </div>
          </div>

          <div className="p-8 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Transaction ID</span>
              <span className="font-mono text-white">{txn.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Account ID</span>
              <span className="text-white font-bold">{txn.userGameId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Date & Time</span>
              <span className="text-white">{txn.date ? new Date(txn.date).toLocaleString() : ''}</span>
            </div>
            <div className="h-px bg-white/5 my-4 border-dashed border-t"></div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold">TOTAL PAID</span>
              <span className="text-2xl font-bold text-primary">{txn.amount}</span>
            </div>
          </div>

          <div className="p-4 bg-background-dark/50 text-center">
            <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.2em]">Thank you for using Avalon Systems</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Link
            to="/"
            className="bg-surface-dark border border-white/10 py-4 rounded-2xl font-bold text-center hover:bg-white/5 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">home</span> HOME
          </Link>
          <Link
            to="/history"
            className="bg-primary text-background-dark py-4 rounded-2xl font-bold text-center shadow-neon hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">history</span> HISTORY
          </Link>
        </div>
      </div>
    </div>
  );
};
