import React, { useState, useEffect } from 'react';
import { Globe, Plus, Trash2, Check, LayoutPanelTop, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../../../context/LanguageContext';

const Localization = () => {
    // connect to real-time context
    const { language, changeLanguage, availableLanguages } = useLanguage();

    const [settings, setSettings] = useState({
        active_languages: availableLanguages, // using context data
        switcher_style: 'travel',
        auto_detect: true,
        show_flags: true
    });

    // In a real app, 'active_languages' would be a subset of a larger 'allLanguages' DB
    // For now, we sync with our Context's available languages

    useEffect(() => {
        // Here we would normally fetch specific settings from backend
        // For this demo, we trust the Context + some local state defaults
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/appearance/theme');
            const data = await res.json();
            if (data.localization) {
                const parsed = JSON.parse(data.localization);
                setSettings(prev => ({ ...prev, ...parsed }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async () => {
        const toastId = toast.loading('Saving localization...');
        try {
            // Save settings to backend
            await fetch('/api/appearance/theme', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ localization: JSON.stringify(settings) })
            });
            toast.success('Settings updated!', { id: toastId });
        } catch (error) {
            toast.error('Failed to save', { id: toastId });
        }
    };

    // Helper to find lang object
    const getLang = (code) => availableLanguages.find(l => l.code === code) || {};

    return (
        <div className="max-w-5xl mx-auto pb-24 space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 1. Language Management */}
                <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                        <Globe className="text-blue-500" size={20} /> Supported Languages
                    </h3>

                    <div className="space-y-3 mb-6">
                        {availableLanguages.map((lang) => (
                            <div key={lang.code} className={`flex items-center justify-between p-3 rounded-xl border transition ${language === lang.code ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{lang.flag}</span>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{lang.name}</p>
                                        <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{lang.code}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {language === lang.code ? (
                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full flex items-center gap-1">
                                            <Check size={10} /> BUSY
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => changeLanguage(lang.code)}
                                            className="text-xs text-white bg-slate-800 hover:bg-black font-medium px-3 py-1.5 rounded-lg transition"
                                        >
                                            Set Active
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500 text-center">
                        Multi-language support is active. Adding new languages requires updating the translation files.
                    </div>
                </section>

                {/* 2. Style & Preview */}
                <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                        <LayoutPanelTop className="text-purple-500" size={20} /> Frontend Switcher Style
                    </h3>

                    <div className="space-y-4">
                        {/* Travel Toggle Card */}
                        <div
                            className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${settings.switcher_style === 'travel' ? 'border-purple-500 bg-purple-50/30' : 'border-slate-100 hover:border-slate-200'}`}
                            onClick={() => setSettings({ ...settings, switcher_style: 'travel' })}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 hidden sm:block">
                                    {/* Mini visual representation */}
                                    <div className="flex bg-slate-100 rounded-full p-1 w-20">
                                        <div className="w-1/2 h-5 bg-white rounded-full shadow-sm"></div>
                                    </div>
                                </div>
                                <div>
                                    <span className="font-bold text-slate-700 text-sm block">Travel Toggle</span>
                                    <span className="text-xs text-slate-400">Rounded sliding toggle with codes</span>
                                </div>
                            </div>
                            {settings.switcher_style === 'travel' && <div className="w-4 h-4 bg-purple-500 rounded-full"></div>}
                        </div>

                        {/* Footer Popup Card */}
                        <div
                            className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${settings.switcher_style === 'footer-popup' ? 'border-purple-500 bg-purple-50/30' : 'border-slate-100 hover:border-slate-200'}`}
                            onClick={() => setSettings({ ...settings, switcher_style: 'footer-popup' })}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 hidden sm:block">
                                    <div className="h-5 w-20 bg-slate-800 rounded-t-lg mt-auto mx-auto"></div>
                                </div>
                                <div>
                                    <span className="font-bold text-slate-700 text-sm block">Popup Tray</span>
                                    <span className="text-xs text-slate-400">Bottom fixed tray with full flags</span>
                                </div>
                            </div>
                            {settings.switcher_style === 'footer-popup' && <div className="w-4 h-4 bg-purple-500 rounded-full"></div>}
                        </div>

                        {/* Live Preview Console */}
                        <div className="mt-8 pt-6 border-t border-slate-50">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-slate-700">Real-time Preview</span>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold flex items-center gap-1"><Eye size={12} /> INTERACTIVE</span>
                            </div>

                            <div className="bg-slate-100 p-8 rounded-xl flex items-center justify-center border border-slate-200 border-dashed min-h-[140px] relative overflow-hidden">

                                {/* Travel Toggle Implementation */}
                                {settings.switcher_style === 'travel' && (
                                    <div className="flex bg-white rounded-full p-1.5 shadow-sm border border-slate-200 gap-1">
                                        {availableLanguages.map(lang => (
                                            <button
                                                key={lang.code}
                                                onClick={() => changeLanguage(lang.code)}
                                                className={`w-10 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${language === lang.code
                                                    ? 'bg-slate-900 text-white shadow-md'
                                                    : 'text-slate-500 hover:bg-slate-50'
                                                    }`}
                                            >
                                                {lang.code.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Popup Implementation */}
                                {settings.switcher_style === 'footer-popup' && (
                                    <div className="absolute bottom-0 w-full flex justify-center">
                                        <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-t-xl shadow-2xl hover:bg-black transition">
                                            <Globe size={16} />
                                            <span className="text-xs font-bold">{getLang(language).name}</span>
                                            <span className="ml-1 opacity-50 text-[10px]">▼</span>
                                        </button>
                                    </div>
                                )}

                            </div>
                            <p className="text-center text-xs text-slate-400 mt-2">Try clicking the buttons above to test global switching.</p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Save Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button onClick={handleSave} className="bg-blue-600 text-white px-8 py-4 rounded-full shadow-2xl shadow-blue-600/30 font-bold hover:bg-blue-700 hover:scale-105 transition flex items-center gap-2">
                    <Check size={20} /> Save Configuration
                </button>
            </div>
        </div>
    );
};

export default Localization;
