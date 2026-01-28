import React from 'react';
import { useTheme } from './ThemeContext';

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-surface-dark border border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden"
            aria-label="Toggle Theme"
        >
            <div className="relative z-10 text-slate-400 group-hover:text-primary transition-colors">
                {theme === 'dark' ? (
                    <span className="material-symbols-outlined text-xl">light_mode</span>
                ) : (
                    <span className="material-symbols-outlined text-xl">dark_mode</span>
                )}
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
        </button>
    );
};
