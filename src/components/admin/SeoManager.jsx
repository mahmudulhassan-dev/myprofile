import React, { useState, useEffect } from 'react';
import { Save, Globe, Search, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const SeoManager = () => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/settings').then(res => res.json()).then(data => {
            setSettings(data);
            setLoading(false);
        });
    }, []);

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        const toastId = toast.loading('Saving SEO settings...');
        await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        toast.success('Saved!', { id: toastId });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);

        const toastId = toast.loading('Uploading...');
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            handleChange('seo_og_image', data.path);
            toast.success('Uploaded', { id: toastId });
        } catch (error) { toast.error('Failed', { id: toastId }); }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold font-sans">SEO & Metadata</h2>
                    <p className="text-slate-500">Optimize your portfolio for search engines.</p>
                </div>
                <button onClick={handleSave} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20">
                    <Save size={18} /> Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Meta Tags */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                    <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-4 flex items-center gap-2">
                        <Search size={18} className="text-blue-500" /> Meta Tags
                    </h3>

                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Global Meta Title</label>
                        <input
                            value={settings.seo_title || settings.site_title || ''}
                            onChange={e => handleChange('seo_title', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500"
                            placeholder="My Portfolio - Developer"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Meta Description</label>
                        <textarea
                            value={settings.seo_description || settings.site_description || ''}
                            onChange={e => handleChange('seo_description', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 h-24 resize-none"
                            placeholder="A brief description of your site for Google results."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Keywords (Comma separated)</label>
                        <textarea
                            value={settings.seo_keywords || ''}
                            onChange={e => handleChange('seo_keywords', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 h-20 resize-none"
                            placeholder="portfolio, developer, react, nodejs..."
                        />
                    </div>
                </div>

                {/* Social Sharing */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                    <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-4 flex items-center gap-2">
                        <Globe size={18} className="text-purple-500" /> Social Sharing (Open Graph)
                    </h3>

                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">OG Image (Social Preview)</label>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition relative">
                            {settings.seo_og_image ? (
                                <img src={settings.seo_og_image} alt="OG Preview" className="h-40 mx-auto object-cover rounded shadow-sm" />
                            ) : (
                                <ImageIcon size={48} className="mx-auto text-slate-300 mb-2" />
                            )}
                            <p className="text-xs text-slate-500 mt-2 font-bold">1200 x 630 Recommended</p>
                            <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Site URL (Canonical)</label>
                        <input
                            value={settings.site_url || ''}
                            onChange={e => handleChange('site_url', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500"
                            placeholder="https://myportfolio.com"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeoManager;
