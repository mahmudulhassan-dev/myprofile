import React from 'react';
import { Share2, Link, ToggleRight } from 'lucide-react';

const SocialSettings = ({ settings, handleChange }) => {
    const socialPlatforms = [
        { id: 'social_facebook', label: 'Facebook', icon: 'facebook' },
        { id: 'social_instagram', label: 'Instagram', icon: 'instagram' },
        { id: 'social_whatsapp', label: 'WhatsApp', icon: 'message-circle' },
        { id: 'social_messenger', label: 'Messenger', icon: 'message-square' },
        { id: 'social_twitter', label: 'Twitter / X', icon: 'twitter' },
        { id: 'social_linkedin', label: 'LinkedIn', icon: 'linkedin' },
        { id: 'social_youtube', label: 'YouTube', icon: 'youtube' },
        { id: 'social_tiktok', label: 'TikTok', icon: 'video' },
        { id: 'social_pinterest', label: 'Pinterest', icon: 'image' },
        { id: 'social_snapchat', label: 'Snapchat', icon: 'ghost' },
        { id: 'social_telegram', label: 'Telegram', icon: 'send' },
        { id: 'social_reddit', label: 'Reddit', icon: 'message-circle' },
        { id: 'social_github', label: 'GitHub', icon: 'github' },
        { id: 'social_dribbble', label: 'Dribbble', icon: 'dribbble' },
        { id: 'social_behance', label: 'Behance', icon: 'behance' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Share2 className="text-blue-500" size={20} /> 4. Social Media Networks
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {socialPlatforms.map(platform => (
                        <div key={platform.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-200 transition group">
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                {/* Using generic icons for simplicity in this artifact, real integration would use specific SVGs or Lucide icons */}
                                <Link size={20} className="text-slate-400 group-hover:text-blue-500 transition" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-slate-700 text-xs font-bold uppercase mb-1">{platform.label}</label>
                                <input
                                    value={settings[platform.id] || ''}
                                    onChange={(e) => handleChange(platform.id, e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:border-blue-500 outline-none transition"
                                    placeholder={`https://${platform.label.toLowerCase().replace(' ', '')}.com/username`}
                                />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">Visible</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings[`${platform.id}_visible`] !== false}
                                        onChange={(e) => handleChange(`${platform.id}_visible`, e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default SocialSettings;
