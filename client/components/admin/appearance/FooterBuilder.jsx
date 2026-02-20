import React, { useState, useEffect } from 'react';
import { Layout, Columns, Box, Type, ArrowUp, Save, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const FooterBuilder = () => {
    const [settings, setSettings] = useState({
        footer_layout: '4-col', // 2-col, 3-col, 4-col, 6-col
        footer_bg_color: '#1e293b',
        footer_text_color: '#ffffff',
        footer_heading_color: '#ffffff',

        // Bottom Bar
        footer_bottom_text: '© 2024 Antigravity. All rights reserved.',
        footer_show_social: true,
        footer_show_payment: true,
        footer_back_to_top: true,
    });

    const [loading, setLoading] = useState(false);

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
        const toastId = toast.loading('Saving footer settings...');
        try {
            await fetch('/api/appearance/theme', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            toast.success('Footer updated!', { id: toastId });
        } catch (error) {
            toast.error('Failed to save', { id: toastId });
        }
    };

    const LayoutOption = ({ id, label, cols }) => (
        <button
            onClick={() => handleChange('footer_layout', id)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${settings.footer_layout === id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-100 bg-white hover:border-slate-200 text-slate-600'
                }`}
        >
            <div className={`w-full h-12 bg-slate-200 rounded mb-3 overflow-hidden opacity-50 flex gap-1 p-1 ${settings.footer_layout === id && 'bg-blue-200'}`}>
                {Array.from({ length: cols }).map((_, i) => (
                    <div key={i} className="bg-slate-400 rounded h-full flex-1"></div>
                ))}
            </div>
            <span className="font-medium text-sm">{label}</span>
        </button>
    );

    return (
        <div className="max-w-5xl mx-auto pb-20 space-y-8 animate-fade-in">

            {/* Layout */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Columns className="text-blue-500" size={20} /> Footer Layout
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <LayoutOption id="2-col" label="2 Columns" cols={2} />
                    <LayoutOption id="3-col" label="3 Columns" cols={3} />
                    <LayoutOption id="4-col" label="4 Columns" cols={4} />
                    <LayoutOption id="6-col" label="6 Columns" cols={6} />
                </div>
            </section>

            {/* Style */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Box className="text-purple-500" size={20} /> Styling
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Background Color</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="color"
                                value={settings.footer_bg_color}
                                onChange={(e) => handleChange('footer_bg_color', e.target.value)}
                                className="h-11 w-11 rounded cursor-pointer border border-slate-200"
                            />
                            <input
                                type="text"
                                value={settings.footer_bg_color}
                                onChange={(e) => handleChange('footer_bg_color', e.target.value)}
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Text Color</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="color"
                                value={settings.footer_text_color}
                                onChange={(e) => handleChange('footer_text_color', e.target.value)}
                                className="h-11 w-11 rounded cursor-pointer border border-slate-200"
                            />
                            <input
                                type="text"
                                value={settings.footer_text_color}
                                onChange={(e) => handleChange('footer_text_color', e.target.value)}
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Heading Color</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="color"
                                value={settings.footer_heading_color}
                                onChange={(e) => handleChange('footer_heading_color', e.target.value)}
                                className="h-11 w-11 rounded cursor-pointer border border-slate-200"
                            />
                            <input
                                type="text"
                                value={settings.footer_heading_color}
                                onChange={(e) => handleChange('footer_heading_color', e.target.value)}
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Bar */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Type className="text-orange-500" size={20} /> Bottom Bar Content
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Copyright Text</label>
                        <input
                            type="text"
                            value={settings.footer_bottom_text}
                            onChange={(e) => handleChange('footer_bottom_text', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3"
                        />
                    </div>
                    <div className="flex gap-6 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.footer_show_social}
                                onChange={(e) => handleChange('footer_show_social', e.target.checked)}
                                className="w-5 h-5 text-blue-600 rounded"
                            />
                            <span className="text-slate-700 font-medium">Show Social Icons</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.footer_show_payment}
                                onChange={(e) => handleChange('footer_show_payment', e.target.checked)}
                                className="w-5 h-5 text-blue-600 rounded"
                            />
                            <span className="text-slate-700 font-medium">Show Payment Methods</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.footer_back_to_top}
                                onChange={(e) => handleChange('footer_back_to_top', e.target.checked)}
                                className="w-5 h-5 text-blue-600 rounded"
                            />
                            <span className="text-slate-700 font-medium">Back to Top Button</span>
                        </label>
                    </div>
                </div>
            </section>

            {/* Widget Areas Mockup */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm opacity-60 pointer-events-none relative">
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
                        Widget Manager Coming Soon
                    </div>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Box className="text-slate-500" size={20} /> Footer Widgets
                </h3>
                <div className="grid grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="border-2 border-dashed border-slate-200 rounded-lg p-4 h-32 flex items-center justify-center text-slate-400 bg-slate-50">
                            Column {i + 1}
                        </div>
                    ))}
                </div>
            </section>

            {/* Save Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-4 rounded-full shadow-xl shadow-blue-500/30 font-bold hover:bg-blue-700 hover:scale-105 transition flex items-center gap-2">
                    <Save size={20} /> Save Footer
                </button>
            </div>
        </div>
    );
};

export default FooterBuilder;
