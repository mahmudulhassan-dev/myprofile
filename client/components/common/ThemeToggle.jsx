import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Cloud, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = React.useState(false);

    const modes = [
        { id: 'light', icon: <Sun size={16} />, label: 'Light' },
        { id: 'dark', icon: <Moon size={16} />, label: 'Dark' },
        { id: 'aurora', icon: <Cloud size={16} />, label: 'Aurora' }
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-widest transition-all hover:shadow-lg"
            >
                {modes.find(m => m.id === theme)?.icon}
                <ChevronDown size={14} className={`${isOpen ? 'rotate-180' : ''} transition-transform`} />
            </button>

            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-50 overflow-hidden"
                >
                    {modes.map(mode => (
                        <button
                            key={mode.id}
                            onClick={() => {
                                toggleTheme(mode.id);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${theme === mode.id
                                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600'
                                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            {mode.icon}
                            {mode.label}
                        </button>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default ThemeToggle;
