import React, { useState, useEffect } from 'react';
import { Share2, Link, Save, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const SocialSettings = () => {
    const [settings, setSettings] = useState({
        social_facebook: '',
        social_twitter: '', // X
        social_instagram: '',
        social_linkedin: '',
        social_youtube: '',
        social_pinterest: '',
        social_tiktok: '',
        social_whatsapp: '',

        // Display Positions
        social_show_header: true,
        social_show_footer: true,
        social_show_sidebar: false,
        social_show_floating: false,
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/appearance/theme');
            const data = await res.json();
            if (Object.keys(data).length > 0) {
                setSettings(prev => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        const toastId = toast.loading('Saving social settings...');
        try {
            await fetch('/api/appearance/theme', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            toast.success('Social settings updated!', { id: toastId });
        } catch (error) {
            toast.error('Failed to save', { id: toastId });
        }
    };

    const SocialInput = ({ id, label, placeholder, color }) => (
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm ${color}`}>
                {label.charAt(0)}
            </div>
            <div className="flex-1">
                <label className="block text-slate-600 text-xs font-bold uppercase mb-1">{label} URL</label>
                <div className="relative">
                    <Link size={14} className="absolute left-3 top-3 text-slate-400" />
                    <input
                        value={settings[id] || ''}
                        onChange={(e) => handleChange(id, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 p-2.5 text-sm focus:border-blue-500 outline-none transition"
                        placeholder={placeholder || "https://..."}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-20 space-y-8 animate-fade-in">
            {/* Positions */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Globe className="text-blue-500" size={20} /> Display Positions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { id: 'social_show_header', label: 'Header' },
                        { id: 'social_show_footer', label: 'Footer' },
                        { id: 'social_show_sidebar', label: 'Sidebar' },
                        { id: 'social_show_floating', label: 'Floating Bar' },
                    ].map(pos => (
                        <label key={pos.id} className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                            <input
                                type="checkbox"
                                checked={settings[pos.id]}
                                onChange={(e) => handleChange(pos.id, e.target.checked)}
                                className="w-5 h-5 text-blue-600 rounded"
                            />
                            <span className="text-slate-700 font-medium">{pos.label}</span>
                        </label>
                    ))}
                </div>
            </section>

            {/* Links */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Share2 className="text-pink-500" size={20} /> Social Profiles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SocialInput id="social_facebook" label="Facebook" color="bg-[#1877F2]" placeholder="facebook.com/yourpage" />
                    <SocialInput id="social_twitter" label="X (Twitter)" color="bg-black" placeholder="x.com/yourhandle" />
                    <SocialInput id="social_instagram" label="Instagram" color="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500" placeholder="instagram.com/yourprofile" />
                    <SocialInput id="social_linkedin" label="LinkedIn" color="bg-[#0A66C2]" placeholder="linkedin.com/in/profile" />
                    <SocialInput id="social_youtube" label="YouTube" color="bg-[#FF0000]" placeholder="youtube.com/channel/..." />
                    <SocialInput id="social_tiktok" label="TikTok" color="bg-black" placeholder="tiktok.com/@user" />
                    <SocialInput id="social_pinterest" label="Pinterest" color="bg-[#BD081C]" placeholder="pinterest.com/profile" />
                    <SocialInput id="social_whatsapp" label="WhatsApp" color="bg-[#25D366]" placeholder="wa.me/number" />
                </div>
            </section>

            {/* Save Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-4 rounded-full shadow-xl shadow-blue-500/30 font-bold hover:bg-blue-700 hover:scale-105 transition flex items-center gap-2">
                    <Save size={20} /> Save Social Settings
                </button>
            </div>
        </div>
    );
};

export default SocialSettings;
