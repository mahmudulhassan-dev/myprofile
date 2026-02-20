import React, { useState } from 'react';
import { Globe, Languages, Clock, MapPin, Plus, Trash2, GripVertical, Check, AlignLeft, AlignRight } from 'lucide-react';
import toast from 'react-hot-toast';

const LanguageSettings = ({ settings, handleChange }) => {

    const [languages, setLanguages] = useState([
        { code: 'en', name: 'English', flag: '🇺🇸', isDefault: true, enabled: true },
        { code: 'bn', name: 'Bengali', flag: '🇧🇩', isDefault: false, enabled: true },
        { code: 'ar', name: 'Arabic', flag: '🇸🇦', isDefault: false, enabled: false, rtl: true },
        { code: 'es', name: 'Spanish', flag: '🇪🇸', isDefault: false, enabled: false },
        { code: 'fr', name: 'French', flag: '🇫🇷', isDefault: false, enabled: false },
        { code: 'de', name: 'German', flag: '🇩🇪', isDefault: false, enabled: false },
        { code: 'zh', name: 'Chinese', flag: '🇨🇳', isDefault: false, enabled: false },
        { code: 'ja', name: 'Japanese', flag: '🇯🇵', isDefault: false, enabled: false },
        { code: 'hi', name: 'Hindi', flag: '🇮🇳', isDefault: false, enabled: false },
        { code: 'pt', name: 'Portuguese', flag: '🇧🇷', isDefault: false, enabled: false },
    ]);

    const dateFormats = [
        { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
        { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (EU)' },
        { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' },
        { value: 'DD MMM YYYY', label: 'DD MMM YYYY (Friendly)' },
        { value: 'MMM DD, YYYY', label: 'MMM DD, YYYY (US Friendly)' },
    ];

    const timeFormats = [
        { value: '12h', label: '12-hour (AM/PM)' },
        { value: '24h', label: '24-hour' },
    ];

    const timezones = [
        { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
        { value: 'Asia/Dhaka', label: 'Asia/Dhaka (GMT+6)' },
        { value: 'America/New_York', label: 'America/New_York (EST)' },
        { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST)' },
        { value: 'Europe/London', label: 'Europe/London (GMT)' },
        { value: 'Europe/Paris', label: 'Europe/Paris (CET)' },
        { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
        { value: 'Asia/Dubai', label: 'Asia/Dubai (GST)' },
        { value: 'Australia/Sydney', label: 'Australia/Sydney (AEST)' },
    ];

    const countries = [
        { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
        { code: 'US', name: 'United States', flag: '🇺🇸' },
        { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
        { code: 'CA', name: 'Canada', flag: '🇨🇦' },
        { code: 'AU', name: 'Australia', flag: '🇦🇺' },
        { code: 'IN', name: 'India', flag: '🇮🇳' },
        { code: 'DE', name: 'Germany', flag: '🇩🇪' },
        { code: 'FR', name: 'France', flag: '🇫🇷' },
        { code: 'JP', name: 'Japan', flag: '🇯🇵' },
        { code: 'AE', name: 'UAE', flag: '🇦🇪' },
    ];

    const toggleLanguage = (code) => {
        setLanguages(prev => prev.map(lang =>
            lang.code === code ? { ...lang, enabled: !lang.enabled } : lang
        ));
        // Save to settings
        const enabledLangs = languages.filter(l => l.code === code ? !l.enabled : l.enabled);
        handleChange('enabled_languages', enabledLangs.filter(l => l.enabled).map(l => l.code).join(','));
    };

    const setDefaultLanguage = (code) => {
        setLanguages(prev => prev.map(lang => ({ ...lang, isDefault: lang.code === code })));
        handleChange('default_language', code);
        toast.success(`Default language set to ${languages.find(l => l.code === code)?.name}`);
    };

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
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Multi-Language System */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Languages className="text-blue-500" size={20} /> Multi-Language System
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <ToggleSwitch label="Enable Multi-Language" description="Allow users to switch languages" settingKey="multilang_enabled" />
                    <ToggleSwitch label="Auto-Detect Language" description="Detect language from browser settings" settingKey="auto_detect_language" />
                </div>

                <div className="mb-4">
                    <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Available Languages</label>
                    <p className="text-xs text-slate-400 mb-3">Toggle to enable/disable languages. Click the star to set as default.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {languages.map(lang => (
                        <div
                            key={lang.code}
                            className={`flex items-center justify-between p-3 rounded-xl border transition ${lang.enabled
                                    ? 'border-blue-200 bg-blue-50'
                                    : 'border-slate-200 bg-slate-50'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{lang.flag}</span>
                                <div>
                                    <p className="font-medium text-slate-800">{lang.name}</p>
                                    <p className="text-xs text-slate-500">{lang.code.toUpperCase()} {lang.rtl && '(RTL)'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {lang.isDefault && (
                                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">Default</span>
                                )}
                                {lang.enabled && !lang.isDefault && (
                                    <button
                                        onClick={() => setDefaultLanguage(lang.code)}
                                        className="text-slate-400 hover:text-yellow-500 transition"
                                        title="Set as default"
                                    >
                                        ★
                                    </button>
                                )}
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={lang.enabled}
                                        onChange={() => toggleLanguage(lang.code)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* RTL Support */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <AlignRight className="text-purple-500" size={20} /> RTL (Right-to-Left) Support
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <ToggleSwitch label="Enable RTL Mode" description="For Arabic, Hebrew, Persian, etc." settingKey="rtl_enabled" />
                    <ToggleSwitch label="Auto-RTL by Language" description="Automatically switch direction based on language" settingKey="auto_rtl" />
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="block text-slate-600 text-xs font-bold uppercase mb-2">RTL Preview Direction</label>
                    <div className="flex gap-4">
                        <button
                            onClick={() => handleChange('text_direction', 'ltr')}
                            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition ${settings.text_direction !== 'rtl' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'
                                }`}
                        >
                            <AlignLeft size={18} /> LTR (Left to Right)
                        </button>
                        <button
                            onClick={() => handleChange('text_direction', 'rtl')}
                            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition ${settings.text_direction === 'rtl' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'
                                }`}
                        >
                            RTL (Right to Left) <AlignRight size={18} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Date, Time, Timezone */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Clock className="text-green-500" size={20} /> Date, Time & Timezone
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Date Format</label>
                        <select
                            value={settings.date_format || 'DD MMM YYYY'}
                            onChange={(e) => handleChange('date_format', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            {dateFormats.map(df => (
                                <option key={df.value} value={df.value}>{df.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Time Format</label>
                        <select
                            value={settings.time_format || '12h'}
                            onChange={(e) => handleChange('time_format', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            {timeFormats.map(tf => (
                                <option key={tf.value} value={tf.value}>{tf.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Timezone</label>
                        <select
                            value={settings.timezone || 'Asia/Dhaka'}
                            onChange={(e) => handleChange('timezone', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            {timezones.map(tz => (
                                <option key={tz.value} value={tz.value}>{tz.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* Country Selector */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <MapPin className="text-red-500" size={20} /> Default Country
                </h3>

                <div>
                    <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Select Default Country</label>
                    <select
                        value={settings.default_country || 'BD'}
                        onChange={(e) => handleChange('default_country', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                    >
                        {countries.map(c => (
                            <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                        ))}
                    </select>
                    <p className="text-xs text-slate-400 mt-2">This will be used as the default for forms, phone numbers, and localization.</p>
                </div>
            </section>
        </div>
    );
};

export default LanguageSettings;
