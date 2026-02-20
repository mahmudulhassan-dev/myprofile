import React from 'react';
import { Search, Globe, BarChart2, Share2, UploadCloud, FileText } from 'lucide-react';

const SeoSettings = ({ settings, handleChange, handleFileUpload }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* 3.1 SEO Meta */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Search className="text-blue-600" size={20} /> 3.1 SEO Meta
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Homepage Meta Title</label>
                        <div className="relative">
                            <input
                                value={settings.meta_title || ''}
                                onChange={(e) => handleChange('meta_title', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 pr-16 text-slate-700 focus:border-blue-500 outline-none transition"
                                placeholder="My Portfolio - Home"
                            />
                            <span className={`absolute right-3 top-3 text-xs font-bold ${settings.meta_title?.length > 60 ? 'text-red-500' : 'text-green-500'}`}>
                                {settings.meta_title?.length || 0}/60
                            </span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Homepage Meta Description</label>
                        <div className="relative">
                            <textarea
                                value={settings.meta_desc || ''}
                                onChange={(e) => handleChange('meta_desc', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none transition h-24"
                                placeholder="A brief description of your site for search engines..."
                            />
                            <span className={`absolute right-3 bottom-3 text-xs font-bold ${settings.meta_desc?.length > 160 ? 'text-red-500' : 'text-green-500'}`}>
                                {settings.meta_desc?.length || 0}/160
                            </span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Meta Keywords</label>
                        <input
                            value={settings.meta_keywords || ''}
                            onChange={(e) => handleChange('meta_keywords', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none transition"
                            placeholder="portfolio, developer, design, react..."
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Canonical URL</label>
                        <input
                            value={settings.canonical_url || ''}
                            onChange={(e) => handleChange('canonical_url', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none transition"
                            placeholder="https://mysite.com"
                        />
                    </div>
                </div>

                <div className="mt-8 border-t border-slate-100 pt-6">
                    <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Share2 size={16} className="text-indigo-500" /> Open Graph (Social Sharing)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-slate-600 text-xs font-bold uppercase mb-1">OG Title</label>
                                <input
                                    value={settings.og_title || ''}
                                    onChange={(e) => handleChange('og_title', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-600 text-xs font-bold uppercase mb-1">OG Description</label>
                                <textarea
                                    value={settings.og_desc || ''}
                                    onChange={(e) => handleChange('og_desc', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none h-20"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-600 text-xs font-bold uppercase mb-2">OG Image</label>
                            <div className="border border-dashed border-slate-300 rounded-xl h-40 flex flex-col items-center justify-center relative hover:bg-slate-50 transition">
                                {settings.og_image ? (
                                    <img src={settings.og_image} alt="OG" className="h-full w-full object-cover rounded-xl opacity-90" />
                                ) : (
                                    <>
                                        <UploadCloud className="text-slate-400 mb-2" size={32} />
                                        <span className="text-xs text-slate-500">Upload 1200x630 Image</span>
                                    </>
                                )}
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'og_image')} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3.2 Search Engine Tools */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Globe className="text-green-500" size={20} /> 3.2 Search Engine Tools
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Robots.txt Editor</label>
                        <textarea
                            value={settings.robots_txt || 'User-agent: *\nDisallow: /admin'}
                            onChange={(e) => handleChange('robots_txt', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-green-400 font-mono text-xs focus:border-blue-500 outline-none h-40"
                        />
                    </div>
                    <div>
                        <div className="mb-4">
                            <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Sitemap.xml</label>
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-700">Auto-Generate Sitemap</p>
                                    <p className="text-xs text-slate-500 mt-1">Updates daily at 00:00 UTC</p>
                                </div>
                                <button className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-700 transition">Regenerate Now</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Schema Markup (JSON-LD)</label>
                            <textarea
                                value={settings.schema_markup || ''}
                                onChange={(e) => handleChange('schema_markup', e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-yellow-400 font-mono text-xs focus:border-blue-500 outline-none h-20"
                                placeholder='{"@context": "https://schema.org", ...}'
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3.3 Analytics & Tracking */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <BarChart2 className="text-orange-500" size={20} /> 3.3 Analytics & Tracking
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        {[
                            { id: 'google_analytics_id', label: 'Google Analytics (GA4)', p: 'G-XXXXXXXX' },
                            { id: 'gtm_id', label: 'Google Tag Manager', p: 'GTM-XXXXXX' },
                            { id: 'fb_pixel_id', label: 'Facebook Pixel ID', p: '1234567890' },
                        ].map(item => (
                            <div key={item.id}>
                                <label className="block text-slate-600 text-xs font-bold uppercase mb-1">{item.label}</label>
                                <input
                                    value={settings[item.id] || ''}
                                    onChange={(e) => handleChange(item.id, e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none"
                                    placeholder={item.p}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="space-y-4">
                        {[
                            { id: 'tiktok_pixel_id', label: 'TikTok Pixel', p: 'pixel_code' },
                            { id: 'linkedin_insight_tag', label: 'LinkedIn Insight Tag', p: 'pid' },
                            { id: 'meta_conversion_token', label: 'Meta Conversion API Token', p: 'Access Token' },
                        ].map(item => (
                            <div key={item.id}>
                                <label className="block text-slate-600 text-xs font-bold uppercase mb-1">{item.label}</label>
                                <input
                                    value={settings[item.id] || ''}
                                    onChange={(e) => handleChange(item.id, e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none"
                                    placeholder={item.p}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3.4 Performance & Optimization */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <FileText className="text-purple-500" size={20} /> 3.4 Performance & Optimization
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { id: 'lazy_load_images', label: 'Lazy Load Images', desc: 'Load images only when they enter viewport' },
                        { id: 'preload_fonts', label: 'Preload Fonts', desc: 'Preload critical fonts for faster rendering' },
                        { id: 'auto_optimize_images', label: 'Auto Image Optimization', desc: 'Compress and convert images to WebP' },
                        { id: 'minify_css', label: 'Minify CSS', desc: 'Compress CSS files for faster loading' },
                        { id: 'minify_js', label: 'Minify JavaScript', desc: 'Compress JavaScript files' },
                        { id: 'enable_gzip', label: 'Enable Gzip Compression', desc: 'Compress all text-based assets' },
                        { id: 'enable_browser_cache', label: 'Browser Caching', desc: 'Cache static assets in browser' },
                        { id: 'defer_js', label: 'Defer JavaScript', desc: 'Load JS after page content' },
                    ].map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div>
                                <h4 className="font-bold text-sm text-slate-700">{item.label}</h4>
                                <p className="text-xs text-slate-500">{item.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings[item.id] === 'true' || settings[item.id] === true}
                                    onChange={(e) => handleChange(item.id, String(e.target.checked))}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default SeoSettings;
