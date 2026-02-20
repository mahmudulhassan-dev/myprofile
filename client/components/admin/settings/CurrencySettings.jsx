import React from 'react';
import { DollarSign, RefreshCw, Globe, Settings, Plus, Trash2, TrendingUp, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const CurrencySettings = ({ settings, handleChange }) => {

    const currencies = [
        { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
        { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', flag: '🇧🇩' },
        { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
        { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
        { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
        { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
        { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦' },
        { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
        { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
        { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
        { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
    ];

    const updateIntervals = [
        { value: '1', label: 'Every Hour' },
        { value: '6', label: 'Every 6 Hours' },
        { value: '12', label: 'Every 12 Hours' },
        { value: '24', label: 'Daily' },
        { value: '168', label: 'Weekly' },
    ];

    const formatOptions = [
        { value: 'symbol_first', label: '$1,234.56 (Symbol First)' },
        { value: 'symbol_last', label: '1,234.56$ (Symbol Last)' },
        { value: 'code_first', label: 'USD 1,234.56 (Code First)' },
        { value: 'code_last', label: '1,234.56 USD (Code Last)' },
    ];

    const decimalOptions = [
        { value: '0', label: '0 decimals (1234)' },
        { value: '2', label: '2 decimals (1234.56)' },
        { value: '3', label: '3 decimals (1234.567)' },
    ];

    const thousandSeparators = [
        { value: ',', label: 'Comma (1,234,567)' },
        { value: '.', label: 'Period (1.234.567)' },
        { value: ' ', label: 'Space (1 234 567)' },
    ];

    const ToggleSwitch = ({ label, description, settingKey }) => (
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
                <h4 className="font-bold text-sm text-slate-700">{label}</h4>
                {description && <p className="text-xs text-slate-400">{description}</p>}
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={settings[settingKey] === 'true' || settings[settingKey] === true}
                    onChange={(e) => handleChange(settingKey, String(e.target.checked))}
                    className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>
    );

    const fetchLiveRate = async () => {
        toast.loading('Fetching live rates...');
        // Simulate API call
        setTimeout(() => {
            handleChange('usd_to_bdt_rate', '119.50');
            handleChange('rate_last_updated', new Date().toISOString());
            toast.dismiss();
            toast.success('Live rates updated!');
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Default Currency */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <DollarSign className="text-green-500" size={20} /> Currency Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Default Currency</label>
                        <select
                            value={settings.default_currency || 'USD'}
                            onChange={(e) => handleChange('default_currency', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            {currencies.map(c => (
                                <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.symbol})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Secondary Currency</label>
                        <select
                            value={settings.secondary_currency || 'BDT'}
                            onChange={(e) => handleChange('secondary_currency', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            {currencies.map(c => (
                                <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.symbol})</option>
                            ))}
                        </select>
                    </div>
                </div>

                <ToggleSwitch
                    label="Show Both Currencies"
                    description="Display prices in both primary and secondary currencies"
                    settingKey="show_dual_currency"
                />
            </section>

            {/* Live Exchange Rate */}
            <section className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-lg text-white">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <TrendingUp size={20} /> Live Exchange Rate (USD → BDT)
                    </h3>
                    <button
                        onClick={fetchLiveRate}
                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                        <RefreshCw size={16} /> Sync Now
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/10 rounded-xl p-4">
                        <p className="text-sm text-white/70 mb-1">Current Rate</p>
                        <p className="text-3xl font-bold">৳ {settings.usd_to_bdt_rate || '119.50'}</p>
                        <p className="text-xs text-white/60 mt-1">1 USD = {settings.usd_to_bdt_rate || '119.50'} BDT</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                        <p className="text-sm text-white/70 mb-1">Last Updated</p>
                        <p className="text-lg font-medium">
                            {settings.rate_last_updated
                                ? new Date(settings.rate_last_updated).toLocaleString()
                                : 'Never'
                            }
                        </p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                        <p className="text-sm text-white/70 mb-1">API Status</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-lg font-medium">Connected</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Auto Update Settings */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Clock className="text-blue-500" size={20} /> Auto-Update Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <ToggleSwitch
                        label="Enable Auto Rate Sync"
                        description="Automatically fetch latest exchange rates"
                        settingKey="auto_rate_sync"
                    />
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Update Interval</label>
                        <select
                            value={settings.rate_update_interval || '24'}
                            onChange={(e) => handleChange('rate_update_interval', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            {updateIntervals.map(i => (
                                <option key={i.value} value={i.value}>{i.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                        <Settings size={16} /> Manual Override
                    </h4>
                    <p className="text-sm text-amber-700 mb-3">Set a custom exchange rate (overrides live rate)</p>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <input
                                type="number"
                                step="0.01"
                                value={settings.manual_rate_override || ''}
                                onChange={(e) => handleChange('manual_rate_override', e.target.value)}
                                className="w-full bg-white border border-amber-300 rounded-lg p-3 text-slate-700 outline-none text-sm"
                                placeholder="e.g. 120.00"
                            />
                        </div>
                        <button
                            onClick={() => {
                                handleChange('use_manual_rate', 'true');
                                toast.success('Manual rate enabled');
                            }}
                            className="bg-amber-500 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-amber-600 transition"
                        >
                            Apply Override
                        </button>
                    </div>
                </div>
            </section>

            {/* Currency Formatting */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Globe className="text-purple-500" size={20} /> Currency Formatting
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Display Format</label>
                        <select
                            value={settings.currency_format || 'symbol_first'}
                            onChange={(e) => handleChange('currency_format', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            {formatOptions.map(f => (
                                <option key={f.value} value={f.value}>{f.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Decimal Places</label>
                        <select
                            value={settings.currency_decimals || '2'}
                            onChange={(e) => handleChange('currency_decimals', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            {decimalOptions.map(d => (
                                <option key={d.value} value={d.value}>{d.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Thousand Separator</label>
                        <select
                            value={settings.thousand_separator || ','}
                            onChange={(e) => handleChange('thousand_separator', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            {thousandSeparators.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Preview</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-white rounded-lg border border-slate-200">
                            <p className="text-slate-500 text-xs mb-1">USD</p>
                            <p className="text-2xl font-bold text-slate-800">$1,234.56</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg border border-slate-200">
                            <p className="text-slate-500 text-xs mb-1">BDT</p>
                            <p className="text-2xl font-bold text-slate-800">৳147,449.77</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CurrencySettings;
