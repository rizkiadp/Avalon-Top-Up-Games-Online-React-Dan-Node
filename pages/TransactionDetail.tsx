
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../services/dbService';
import { Transaction } from '../types';

export const TransactionDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [txn, setTxn] = useState<Transaction | null>(null);

    useEffect(() => {
        if (id) {
            db.getTransactionById(id).then(data => {
                if (data) setTxn(data);
            });
        }
    }, [id]);

    if (!txn) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <p className="text-slate-500 animate-pulse">Loading Transaction Data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-12 px-6 cyber-grid flex flex-col items-center">
            <div className="max-w-xl w-full">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/history" className="size-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold uppercase">Transaction Details</h1>
                        <p className="text-slate-400 text-xs font-mono tracking-widest uppercase">ID: {txn.id}</p>
                    </div>
                </div>

                {/* Receipt Panel */}
                <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <span className="material-symbols-outlined text-[100px] text-white/5">receipt_long</span>
                    </div>

                    <div className="bg-surface-dark p-6 border-b border-white/5 flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-4">
                            <img src={txn.gameIcon || 'https://via.placeholder.com/50'} className="size-12 rounded-xl object-cover shadow-lg" alt="" />
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{txn.gameName}</p>
                                <div className="flex items-center gap-2">
                                    <span className={`size-2 rounded-full ${txn.status === 'Success' ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></span>
                                    <p className={`font-bold ${txn.status === 'Success' ? 'text-green-400' : 'text-yellow-400'}`}>{txn.status.toUpperCase()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-slate-500 font-mono uppercase">Payment Method</p>
                            <p className="text-xs font-bold text-white">QRIS/VA</p>
                        </div>
                    </div>

                    <div className="p-8 space-y-6 relative z-10">
                        <div className="grid grid-cols-2 gap-y-6">
                            <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Product</p>
                                <p className="text-white font-medium">{txn.item}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">User Account</p>
                                <p className="text-white font-mono">{txn.userGameId}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Created At</p>
                                <p className="text-slate-300 text-sm">{txn.date ? new Date(txn.date).toLocaleString() : ''}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">System Ref</p>
                                <p className="text-slate-300 text-sm font-mono">{txn.id}</p>
                            </div>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                            <span className="text-slate-400 font-bold text-sm">TOTAL PAID</span>
                            <span className="text-2xl font-bold text-primary">{txn.amount}</span>
                        </div>
                    </div>

                    <div className="p-4 bg-background-dark/50 flex justify-between items-center">
                        <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">verified</span> Authenticated Receipt
                        </p>
                        <button className="text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1" onClick={() => window.print()}>
                            <span className="material-symbols-outlined text-sm">print</span> PRINT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
