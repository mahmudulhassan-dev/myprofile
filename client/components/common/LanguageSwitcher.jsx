import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = React.useState(false);

    const languages = [
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },
        { code: 'es', label: 'Español', flag: '🇪🇸' },
        { code: 'ar', label: 'العربية', flag: '🇸🇦' }
    ];

    const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-widest transition-all hover:shadow-lg"
            >
                <Globe size={16} />
                <span>{currentLanguage.code}</span>
                <ChevronDown size={14} className={`${isOpen ? 'rotate-180' : ''} transition-transform`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-50 pointer-events-auto"
                    >
                        {languages.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    i18n.changeLanguage(lang.code);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${i18n.language === lang.code
                                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <span className="flex items-center gap-3">
                                    <span className="text-lg">{lang.flag}</span>
                                    {lang.label}
                                </span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSwitcher;
