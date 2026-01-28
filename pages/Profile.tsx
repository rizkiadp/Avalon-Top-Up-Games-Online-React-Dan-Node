import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/dbService';

export const Profile: React.FC = () => {
    const navigate = useNavigate();
    const user = db.getCurrentUser();

    // States for password change
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // States for email change
    const [emailPassword, setEmailPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');

    // UI States
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Verification State
    const [isVerifying, setIsVerifying] = useState(false);
    const [otp, setOtp] = useState('');
    const [pendingEmail, setPendingEmail] = useState('');

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (newPassword !== confirmPassword) {
            setMessage({ text: "New passwords do not match!", type: 'error' });
            return;
        }

        setIsLoading(true);
        try {
            await db.changePassword(user.id, oldPassword, newPassword);
            setMessage({ text: "Password updated successfully!", type: 'success' });
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setMessage({ text: error.message || "Failed to update password", type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsLoading(true);

        try {
            const res = await db.changeEmail(user.id, emailPassword, newEmail);
            if (res.needsVerification) {
                setPendingEmail(newEmail);
                setIsVerifying(true);
                setMessage({ text: "Verification code sent to new email!", type: 'success' });
            }
        } catch (error: any) {
            setMessage({ text: error.message || "Failed to update email", type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setIsLoading(true);
        try {
            await db.verifyEmail(pendingEmail, otp);
            setMessage({ text: "Email verified successfully! Please login again.", type: 'success' });
            // Logout user to force re-login with new details/token if needed
            setTimeout(() => {
                db.logout();
                navigate('/login');
            }, 2000);
        } catch (error: any) {
            setMessage({ text: error.message || "Verification failed", type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-12 px-6 cyber-grid">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/')} className="p-2 rounded-xl bg-surface-dark border border-white/10 hover:bg-white/5 transition-all">
                        <span className="material-symbols-outlined text-slate-400">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-tighter">Profile Settings</h1>
                        <p className="text-slate-400 text-sm">Manage your account security and preferences</p>
                    </div>
                </div>

                {message && (
                    <div className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-500'} flex items-center gap-2`}>
                        <span className="material-symbols-outlined">{message.type === 'success' ? 'check_circle' : 'error'}</span>
                        <p className="font-bold text-sm">{message.text}</p>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                    {/* User Info Card */}
                    <div className="glass-panel p-8 rounded-3xl border border-dark h-fit">
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative">
                                <img src={user.avatar} className="size-24 rounded-full border-2 border-primary shadow-neon" alt="Avatar" />
                                <div className="absolute bottom-0 right-0 p-1.5 bg-background-dark border border-white/10 rounded-full">
                                    <span className="material-symbols-outlined text-xs text-primary">edit</span>
                                </div>
                            </div>
                            <h2 className="mt-4 text-xl font-bold text-main">{user.username}</h2>
                            <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold rounded-full uppercase mt-2">{user.vipLevel} Member</span>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-surface-accent rounded-xl border border-dark">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Current Email</p>
                                <p className="font-mono text-main">{user.email}</p>
                            </div>
                            <div className="p-4 bg-surface-accent rounded-xl border border-dark">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Account ID</p>
                                <p className="font-mono text-slate-400">#{user.id}</p>
                            </div>
                            {/* Credits Removed */}
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Change Password */}
                        <div className="glass-panel p-8 rounded-3xl border border-dark">
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">lock_reset</span>
                                Change Password
                            </h3>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Current Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        className="w-full bg-surface-accent border border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-main"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-surface-accent border border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-main"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Confirm</label>
                                        <input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-surface-accent border border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-main"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-primary text-background-dark py-3 rounded-xl font-bold shadow-neon hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {isLoading ? 'Updating...' : 'UPDATE PASSWORD'}
                                </button>
                            </form>
                        </div>

                        {/* Change Email */}
                        <div className="glass-panel p-8 rounded-3xl border border-dark">
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-secondary">mail</span>
                                Change Email
                            </h3>

                            {!isVerifying ? (
                                <form onSubmit={handleChangeEmail} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">New Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            className="w-full bg-surface-accent border border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-main"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Current Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={emailPassword}
                                            onChange={(e) => setEmailPassword(e.target.value)}
                                            className="w-full bg-surface-accent border border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-main"
                                            placeholder="Confirm your identity"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-surface-dark border border-dark text-slate-400 hover:text-white hover:bg-white/5 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                                    >
                                        {isLoading ? 'Processing...' : 'UPDATE EMAIL'}
                                    </button>
                                </form>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                    <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl text-center">
                                        <p className="text-primary font-bold text-sm mb-1">Verify New Email</p>
                                        <p className="text-xs text-slate-400">Code sent to: {pendingEmail}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Verification Code</label>
                                        <input
                                            type="text"
                                            required
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="w-full bg-surface-accent border border-dark rounded-xl px-4 py-3 text-center text-xl tracking-[1em] font-mono focus:outline-none focus:border-primary text-main"
                                            placeholder="••••••"
                                            maxLength={6}
                                        />
                                    </div>
                                    <button
                                        onClick={handleVerifyOtp}
                                        disabled={isLoading}
                                        className="w-full bg-primary text-background-dark py-3 rounded-xl font-bold shadow-neon hover:scale-[1.02] transition-all disabled:opacity-50"
                                    >
                                        {isLoading ? 'Verifying...' : 'CONFIRM CHANGE'}
                                    </button>
                                    <button
                                        onClick={() => setIsVerifying(false)}
                                        className="w-full text-xs font-bold text-slate-500 hover:text-white transition-colors"
                                    >
                                        CANCEL
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
