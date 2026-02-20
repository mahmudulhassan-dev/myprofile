import React from 'react';
import { Activity, Globe, Hash, Server, Eye, Zap, ShieldCheck } from 'lucide-react';

const TrackingSettings = ({ settings, handleChange }) => {

    const PixelCard = ({ id, label, icon: Icon, color, placeholder }) => (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition group">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${color} text-white shadow-sm group-hover:scale-110 transition`}>
                        <Icon size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">{label}</h4>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{id.replace('_', ' ')}</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings[`tracker_${id}_enabled`] !== false}
                        onChange={(e) => handleChange(`tracker_${id}_enabled`, e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>

            <div className={`transition-all duration-300 ${settings[`tracker_${id}_enabled`] !== false ? 'opacity-100 max-h-40' : 'opacity-40 max-h-40 blur-[1px] pointer-events-none'}`}>
                <input
                    value={settings[`tracker_${id}_id`] || ''}
                    onChange={(e) => handleChange(`tracker_${id}_id`, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-mono text-slate-700 outline-none focus:border-blue-500 transition"
                    placeholder={placeholder || "ID: XXXXXXXXXX"}
                />
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* 1. Major Platforms */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Globe className="text-blue-600" size={20} /> Major Advertising Platforms
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <PixelCard id="facebook" label="Facebook Pixel" icon={Activity} color="bg-blue-600" placeholder="Pixel ID (e.g. 123456789)" />
                    <PixelCard id="tiktok" label="TikTok Pixel" icon={Hash} color="bg-black" placeholder="Pixel ID (e.g. C5...)" />
                    <PixelCard id="google_ads" label="Google Ads" icon={Globe} color="bg-blue-500" placeholder="Conversion ID (AW-XXXX)" />
                    <PixelCard id="snapchat" label="Snapchat Pixel" icon={Hash} color="bg-yellow-400 text-black" placeholder="Pixel ID" />
                    <PixelCard id="twitter" label="X (Twitter) Pixel" icon={Hash} color="bg-slate-900" placeholder="Pixel ID" />
                    <PixelCard id="pinterest" label="Pinterest Tag" icon={Hash} color="bg-red-600" placeholder="Tag ID" />
                    <PixelCard id="linkedin" label="LinkedIn Insights" icon={Hash} color="bg-blue-700" placeholder="Partner ID" />
                    <PixelCard id="reddit" label="Reddit Pixel" icon={Hash} color="bg-orange-600" placeholder="Pixel ID" />
                    <PixelCard id="quora" label="Quora Pixel" icon={Hash} color="bg-red-800" placeholder="Pixel ID" />
                </div>
            </section>

            {/* 2. Facebook CAPI (Server Side) */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Server className="text-indigo-600" size={20} /> Facebook Conversion API (CAPI)
                </h3>
                <div className="flex items-start gap-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl mb-6">
                    <Zap className="text-indigo-600 mt-1" size={20} />
                    <div>
                        <h4 className="font-bold text-indigo-900 text-sm">Why Enable CAPI?</h4>
                        <p className="text-xs text-indigo-800/80 mt-1">Bypass iOS 14+ tracking restrictions and ad blockers by sending events directly from the server. Requires Pixel ID to be set above.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Access Token</label>
                        <textarea
                            value={settings.fb_capi_token || ''}
                            onChange={(e) => handleChange('fb_capi_token', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none h-24 font-mono text-xs"
                            placeholder="EAAG..."
                        />
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Test Event Code (Optional)</label>
                            <input
                                value={settings.fb_test_event_code || ''}
                                onChange={(e) => handleChange('fb_test_event_code', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none font-mono text-xs"
                                placeholder="TEST1234"
                            />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <div>
                                <h4 className="text-sm font-bold text-slate-700">Enable Server-Side Events</h4>
                                <p className="text-xs text-slate-500">Send 'ViewContent', 'AddToCart', 'Purchase' from server.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={settings.fb_capi_enabled || false} onChange={(e) => handleChange('fb_capi_enabled', e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Heatmaps & Behavior */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Eye className="text-orange-500" size={20} /> Heatmaps & Behavior Recording
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PixelCard id="hotjar" label="Hotjar" icon={Activity} color="bg-red-500" placeholder="Site ID (e.g. 1234567)" />
                    <PixelCard id="clarity" label="Microsoft Clarity" icon={Activity} color="bg-blue-400" placeholder="Project ID" />
                    <PixelCard id="mouseflow" label="Mouseflow" icon={Activity} color="bg-green-500" placeholder="Website ID" />
                    <PixelCard id="luckyorange" label="Lucky Orange" icon={Activity} color="bg-orange-600" placeholder="Site ID" />
                </div>
            </section>
        </div>
    );
};

export default TrackingSettings;
