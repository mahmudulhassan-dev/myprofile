import React, { useState, useEffect, useCallback } from 'react';
import {
    Settings, Globe, CreditCard, Bell,
    Save, RefreshCw, DollarSign, Percent,
    ShieldCheck, Mail, Info
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const MHSettings = () => {
    const [settings, setSettings] = useState({
        store_currency: 'BDT',
        store_tax_rate: '15',
        low_stock_threshold: '5',
        order_notification_email: 'admin@amanaflow.com',
        store_name: 'MH Commerce Cluster',
        maintenance_mode: 'false'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchSettings = useCallback(async () => {
        try {
            const res = await axios.get('/api/admin/system/settings/commerce');
            if (Object.keys(res.data).length > 0) {
                setSettings(prev => ({ ...prev, ...res.data }));
            }
            setLoading(false);
        } catch {
            console.error('Settings fetch error');
            toast.error('Failed to sync global variables');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        if (isMounted) fetchSettings();
        return () => { isMounted = false; };
    }, [fetchSettings]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.post('/api/admin/system/settings', {
                settings,
                group: 'commerce'
            });
            toast.success('System parameters synchronized');
        } catch (error) {
            toast.error('Synchronization failed');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
            <RefreshCw className="animate-spin text-blue-500" size={32} />
            <p className="animate-pulse tracking-widest text-xs uppercase font-bold text-blue-500/50">Accessing Core Config...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800 tracking-tight">System Core</h1>
                    <p className="text-slate-500 mt-1 font-medium flex items-center gap-2">
                        <Settings size={16} className="text-blue-500" />
                        Universal Parameters Hub
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
                >
                    {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                    Sync All Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Settings Grid */}
                <div className="lg:col-span-2 space-y-6">
                    {/* General Section */}
                    <div className="aurora-glass-card p-8 rounded-[2.5rem] border border-white/5">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Globe size={20} className="text-blue-400" /> Identity Matrix
                        </h3>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Store Designation</label>
                                <input
                                    type="text"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500/50 transition-all font-medium"
                                    value={settings.store_name}
                                    onChange={(e) => handleChange('store_name', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Financial Section */}
                    <div className="aurora-glass-card p-8 rounded-[2.5rem] border border-white/5">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <CreditCard size={20} className="text-emerald-400" /> Fiscal Logic
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Currency Code</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all font-medium"
                                        value={settings.store_currency}
                                        onChange={(e) => handleChange('store_currency', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Tax Variable (%)</label>
                                <div className="relative">
                                    <Percent className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="number"
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all font-medium"
                                        value={settings.store_tax_rate}
                                        onChange={(e) => handleChange('store_tax_rate', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Logistics Section */}
                    <div className="aurora-glass-card p-8 rounded-[2.5rem] border border-white/5">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <ShieldCheck size={20} className="text-rose-400" /> Logistics Protocol
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Stock Threshold</label>
                                <input
                                    type="number"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white outline-none focus:border-rose-500/50 transition-all font-medium"
                                    value={settings.low_stock_threshold}
                                    onChange={(e) => handleChange('low_stock_threshold', e.target.value)}
                                />
                                <p className="text-[10px] text-slate-500 font-medium pl-1 italic">Alert trigger for depletion shields</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Neural Alert Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="email"
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-white outline-none focus:border-rose-500/50 transition-all font-medium"
                                        value={settings.order_notification_email}
                                        onChange={(e) => handleChange('order_notification_email', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Sidebar */}
                <div className="space-y-6">
                    <div className="aurora-glass-card p-8 rounded-[2.5rem] border border-white/5">
                        <div className="flex items-center gap-3 text-blue-400 mb-4">
                            <Info size={24} />
                            <h4 className="font-bold uppercase tracking-widest text-xs">Runtime Info</h4>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
                            These parameters govern the core behavioral logic of the Commerce Cluster.
                            Changes are applied globally across all active store nodes instantly upon synchronization.
                        </p>
                        <div className="mt-8 space-y-4 pt-8 border-t border-white/5">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500 font-bold uppercase tracking-widest">Environment</span>
                                <span className="text-emerald-400 font-mono">PRODUCTION-v6</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500 font-bold uppercase tracking-widest">Sync Latency</span>
                                <span className="text-blue-400 font-mono">~124ms</span>
                            </div>
                        </div>
                    </div>

                    <div className="aurora-glass-card p-8 rounded-[2.5rem] border border-rose-500/10">
                        <div className="flex items-center gap-3 text-rose-500 mb-4">
                            <ShieldCheck size={24} />
                            <h4 className="font-bold uppercase tracking-widest text-xs">Security Protocol</h4>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-300 font-bold">Lock Cluster</span>
                            <button
                                onClick={() => handleChange('maintenance_mode', settings.maintenance_mode === 'true' ? 'false' : 'true')}
                                className={`w-12 h-6 rounded-full transition-all relative ${settings.maintenance_mode === 'true' ? 'bg-rose-600' : 'bg-slate-700'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.maintenance_mode === 'true' ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MHSettings;
