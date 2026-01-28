import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

export const Register: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'form' | 'otp'>('form');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(600); // 10 minutes

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await res.json();

            if (res.ok) {
                if (data.needsVerification) {
                    setStep('otp');
                    setTimer(600); // Reset timer
                } else {
                    alert("Registration Successful! Please Login.");
                    navigate('/login');
                }
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            setError("Network Error. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/auth/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp })
            });

            const data = await res.json();

            if (res.ok) {
                alert("Verification Successful! Account Verified.");
                navigate('/login');
            } else {
                setError(data.message || "Verification failed");
            }
        } catch (err) {
            setError("Network Error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Timer logic for OTP
    useEffect(() => {
        if (step === 'otp') {
            const interval = setInterval(() => {
                setTimer((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [step]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-4">
            <div className="glass-panel w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-neon relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/20 blur-[60px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold mb-2 uppercase tracking-wide">{step === 'form' ? 'Join Avalon' : 'Verify Email'}</h1>
                        <p className="text-slate-400 text-sm">
                            {step === 'form' ? 'Create your account to start top-up' : `Enter code sent to ${formData.email}`}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg mb-6 text-center">
                            {error}
                        </div>
                    )}

                    {step === 'form' ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Username</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 group-focus-within:text-primary transition-colors text-lg">person</span>
                                    <input
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full bg-surface-accent border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-main focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(37,192,244,0.1)] transition-all placeholder:text-slate-600"
                                        placeholder="Enter username"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Email</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 group-focus-within:text-primary transition-colors text-lg">mail</span>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-surface-accent border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-main focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(37,192,244,0.1)] transition-all placeholder:text-slate-600"
                                        placeholder="Enter email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Password</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 group-focus-within:text-primary transition-colors text-lg">lock</span>
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-surface-accent border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-main focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(37,192,244,0.1)] transition-all placeholder:text-slate-600"
                                        placeholder="Create password"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Confirm Password</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 group-focus-within:text-primary transition-colors text-lg">task_alt</span>
                                    <input
                                        type="password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full bg-surface-accent border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-main focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(37,192,244,0.1)] transition-all placeholder:text-slate-600"
                                        placeholder="Repeat password"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-primary to-secondary text-background-dark font-bold py-4 rounded-xl shadow-neon hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                            >
                                {isLoading ? 'Sending OTP...' : 'Next'}
                            </button>

                            <div className="text-center mt-6">
                                <p className="text-xs text-slate-500">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-primary hover:text-white font-bold transition-colors">
                                        Login here
                                    </Link>
                                </p>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in slide-in-from-right duration-300">
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-lg">lock_clock</span>
                                <input
                                    type="text"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full bg-background-dark/50 border border-white/10 rounded-xl pl-11 pr-4 py-4 text-center text-2xl font-mono tracking-[0.5em] focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(37,192,244,0.1)] transition-all placeholder:text-slate-600 placeholder:tracking-normal placeholder:text-sm"
                                    placeholder="- - - - - -"
                                />
                            </div>

                            <div className="flex justify-between items-center px-2">
                                <div className="text-xs font-mono text-slate-500">
                                    Expires in: <span className="text-primary">{formatTime(timer)}</span>
                                </div>
                                <button type="button" onClick={() => setStep('form')} className="text-xs text-slate-500 hover:text-white">
                                    Change Email
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-primary to-secondary text-background-dark font-bold py-4 rounded-xl shadow-neon hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Verifying...' : 'VERIFY & REGISTER'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
