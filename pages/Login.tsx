
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../services/dbService';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isAdminMode = username.toLowerCase() === 'admin';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }) // Send password as plain text as requested: admin/admin
      });

      const data = await response.json();

      if (response.ok) {
        // Success
        setTimeout(() => {
          setIsLoading(false);
          // Store token if needed, or just navigate based on role
          localStorage.setItem('avalon_session', JSON.stringify(data));
          navigate(data.role.toLowerCase() === 'admin' ? '/admin' : '/');
        }, 1000);
      } else {
        // Error
        setIsLoading(false);
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      alert("Login error");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-6 transition-colors duration-500 ${isAdminMode ? 'bg-red-950/20' : 'bg-background-dark'} cyber-grid relative overflow-hidden`}>
      {/* Background Decor */}
      <div className={`absolute top-1/4 left-1/4 size-[500px] blur-[120px] rounded-full animate-pulse transition-colors duration-500 ${isAdminMode ? 'bg-red-600/10' : 'bg-primary/10'}`}></div>
      <div className={`absolute bottom-1/4 right-1/4 size-[500px] blur-[120px] rounded-full animate-pulse [animation-delay:2s] transition-colors duration-500 ${isAdminMode ? 'bg-orange-600/10' : 'bg-secondary/10'}`}></div>

      <div className="w-full max-w-md relative z-10">
        <div className={`glass-panel p-10 rounded-3xl border transition-all duration-500 ${isAdminMode ? 'border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.2)]' : 'border-white/10 shadow-2xl'}`}>
          <div className="text-center mb-10">
            <div className={`size-16 rounded-2xl flex items-center justify-center text-background-dark shadow-neon mx-auto mb-6 transition-all duration-500 ${isAdminMode ? 'bg-gradient-to-br from-red-500 to-orange-600 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-gradient-to-br from-primary to-secondary'}`}>
              <span className="material-symbols-outlined text-4xl font-bold">
                {isAdminMode ? 'admin_panel_settings' : 'lock_open'}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tighter uppercase">
              {isAdminMode ? 'Root Access' : 'Access Terminal'}
            </h1>
            <p className={`text-sm mt-2 uppercase tracking-[0.3em] font-mono transition-colors duration-500 ${isAdminMode ? 'text-red-400' : 'text-slate-500'}`}>
              {isAdminMode ? 'Level 4 Clearance Required' : 'Initialize Security Protocol'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Username / Alias</label>
              <div className="relative">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] transition-colors ${isAdminMode ? 'text-red-500' : 'text-slate-500'}`}>person</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full bg-background-dark/50 border rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none transition-all font-body ${isAdminMode ? 'border-red-500/50 focus:border-red-400' : 'border-white/10 focus:border-primary'}`}
                  placeholder="Enter credentials..."
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Access Code</label>
              <div className="relative">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] transition-colors ${isAdminMode ? 'text-red-500' : 'text-slate-500'}`}>key</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-background-dark/50 border rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none transition-all font-body ${isAdminMode ? 'border-red-500/50 focus:border-red-400' : 'border-white/10 focus:border-primary'}`}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-background-dark py-4 rounded-xl font-bold text-lg shadow-neon hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 ${isAdminMode ? 'bg-gradient-to-r from-red-600 to-orange-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-gradient-to-r from-primary to-secondary'}`}
            >
              {isLoading ? (
                <>
                  <span className="size-5 border-2 border-background-dark border-t-transparent rounded-full animate-spin"></span>
                  AUTHORIZING...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">{isAdminMode ? 'terminal' : 'login'}</span>
                  {isAdminMode ? 'OVERRIDE SYSTEM' : 'ENTER SYSTEM'}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4 text-center">
            <p className="text-xs text-slate-500">New operator? <Link to="/register" className="text-primary hover:underline">Register Sub-Protocol</Link></p>
            <button className="text-[10px] text-slate-600 font-mono hover:text-white transition-colors uppercase tracking-widest" type="button">Emergency Data Recovery</button>
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] text-slate-700 font-mono tracking-widest uppercase">
          Signal: Secure // Node: Avalon-Mainframe // Ping: 14ms
        </p>
      </div>
    </div>
  );
};
