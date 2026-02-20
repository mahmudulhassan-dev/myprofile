import React from 'react';
import { CreditCard, DollarSign, Activity } from 'lucide-react';

const PaymentSettings = ({ settings, handleChange }) => {

    const GatewayCard = ({ id, label, icon }) => (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {/* Placeholder Icons - Real app would use SVG/Images */}
                    <div className="w-8 h-8 rounded bg-white shadow-sm flex items-center justify-center font-bold text-xs text-slate-700">{label.substring(0, 2)}</div>
                    <h4 className="font-bold text-slate-700 text-sm">{label}</h4>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={settings[`payment_${id}_enabled`] || false} onChange={(e) => handleChange(`payment_${id}_enabled`, e.target.checked)} className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>

            {settings[`payment_${id}_enabled`] && (
                <div className="space-y-3 animate-fade-in">
                    <div>
                        <input
                            value={settings[`payment_${id}_public`] || ''}
                            onChange={(e) => handleChange(`payment_${id}_public`, e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded p-2 text-xs outline-none"
                            placeholder="Public / Client Key"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            value={settings[`payment_${id}_secret`] || ''}
                            onChange={(e) => handleChange(`payment_${id}_secret`, e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded p-2 text-xs outline-none"
                            placeholder="Secret Key"
                        />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" checked={settings[`payment_${id}_sandbox`] || false} onChange={(e) => handleChange(`payment_${id}_sandbox`, e.target.checked)} id={`sand_${id}`} />
                        <label htmlFor={`sand_${id}`} className="text-xs text-slate-500 cursor-pointer">Enable Sandbox / Test Mode</label>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* 6.2 Currency */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <DollarSign className="text-green-600" size={20} /> 6.2 Currency Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Default Currency</label>
                        <select
                            value={settings.currency_default || 'USD'}
                            onChange={(e) => handleChange('currency_default', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none cursor-pointer font-bold"
                        >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="BDT">BDT (৳)</option>
                            <option value="GBP">GBP (£)</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Exchange Rate provider (API)</label>
                        <div className="flex gap-2">
                            <input
                                value={settings.currency_api_key || ''}
                                onChange={(e) => handleChange('currency_api_key', e.target.value)}
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none"
                                placeholder="ExchangeRate-API Key"
                            />
                            <button className="bg-green-600 text-white px-4 rounded-lg text-sm font-bold hover:bg-green-700 transition flex items-center gap-2">
                                <Activity size={16} /> Sync Rates
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                    <div>
                        <h4 className="text-blue-900 font-bold text-sm">Auto-Update Rates</h4>
                        <p className="text-blue-700/70 text-xs">Automatically fetch new exchange rates every hour.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={settings.currency_auto_update || false} onChange={(e) => handleChange('currency_auto_update', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-blue-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-blue-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </section>

            {/* 6.1 Gateways */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <CreditCard className="text-indigo-500" size={20} /> 6.1 Payment Gateways
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <GatewayCard id="stripe" label="Stripe" />
                    <GatewayCard id="paypal" label="PayPal" />
                    <GatewayCard id="sslcommerz" label="SSLCOMMERZ" />
                    <GatewayCard id="bkash" label="bKash" />
                    <GatewayCard id="nagad" label="Nagad" />
                    <GatewayCard id="crypto" label="Crypto (Coinbase)" />
                </div>
            </section>
        </div>
    );
};

export default PaymentSettings;
