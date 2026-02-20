import React, { useState, useEffect } from 'react';
import { RefreshCw, ALargeSmall, Palette, Layout, Move, Layers, Grid } from 'lucide-react';
import toast from 'react-hot-toast';

const GlobalTheme = () => {
    const [settings, setSettings] = useState({
        // Brand Colors
        primary_color: '#4f46e5',
        secondary_color: '#ec4899',
        accent_color: '#f59e0b',

        // Semantic Colors
        success_color: '#22c55e',
        warning_color: '#eab308',
        info_color: '#3b82f6',
        danger_color: '#ef4444',

        // Base Colors
        background_color: '#f8fafc',
        text_color_primary: '#1e293b',
        text_color_secondary: '#64748b',

        // Gradients
        enable_gradients: false,
        primary_gradient_start: '#4f46e5',
        primary_gradient_end: '#6366f1',
        primary_gradient_direction: 'to right', // to right, to bottom, to bottom right

        // Mode
        dark_mode: 'system', // system, light, dark

        // Typography
        font_family: 'Inter',
        font_base_size: '16',
        font_weight_base: '400',
        font_weight_heading: '700',
        line_height: '1.6',
        letter_spacing: '0',

        // Styling
        border_radius: '0.5rem', // sm, md, lg, xl, full
        container_width: '1280px', // boxed width
        layout_mode: 'boxed', // full, boxed, fluid

        // Spacing
        spacing_padding_base: '1rem',
        spacing_section_gap: '4rem',

        // Shadows
        shadow_style: 'soft', // soft, medium, hard
        shadow_opacity: '0.1', // 0.1 to 1

        // Animation
        animation_style: 'fade' // fade, slide, none
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
        const toastId = toast.loading('Saving theme...');
        try {
            await fetch('/api/appearance/theme', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            toast.success('Theme updated!', { id: toastId });
        } catch (error) {
            toast.error('Failed to save', { id: toastId });
        }
    };

    const ColorInput = ({ label, id }) => (
        <div>
            <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">{label}</label>
            <div className="flex gap-2 items-center">
                <input
                    type="color"
                    value={settings[id]}
                    onChange={(e) => handleChange(id, e.target.value)}
                    className="h-9 w-9 rounded-lg overflow-hidden cursor-pointer border border-slate-200 p-0.5 bg-white"
                />
                <input
                    type="text"
                    value={settings[id]}
                    onChange={(e) => handleChange(id, e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-mono uppercase focus:border-blue-500 outline-none"
                    maxLength={7}
                />
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-24">

            {/* 1. Core Palette */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Palette className="text-indigo-500" size={20} /> Color System
                </h3>

                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Brand Colors</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                    <ColorInput label="Primary" id="primary_color" />
                    <ColorInput label="Secondary" id="secondary_color" />
                    <ColorInput label="Accent" id="accent_color" />
                    <ColorInput label="Background" id="background_color" />
                    <ColorInput label="Text Primary" id="text_color_primary" />
                    <ColorInput label="Text Secondary" id="text_color_secondary" />
                </div>

                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Semantic Colors</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <ColorInput label="Success" id="success_color" />
                    <ColorInput label="Warning" id="warning_color" />
                    <ColorInput label="Info" id="info_color" />
                    <ColorInput label="Danger" id="danger_color" />
                </div>
            </section>

            {/* 2. Gradient Builder */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-50">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Layers className="text-pink-500" size={20} /> Gradient Builder
                    </h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.enable_gradients}
                            onChange={(e) => handleChange('enable_gradients', e.target.checked)}
                            className="toggle-checkbox"
                        />
                        <span className="text-sm font-medium text-slate-600">Enable Gradients</span>
                    </label>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity ${!settings.enable_gradients ? 'opacity-50 pointer-events-none' : ''}`}>
                    <ColorInput label="Gradient Start" id="primary_gradient_start" />
                    <ColorInput label="Gradient End" id="primary_gradient_end" />
                    <div>
                        <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">Direction</label>
                        <select
                            value={settings.primary_gradient_direction}
                            onChange={(e) => handleChange('primary_gradient_direction', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm"
                        >
                            <option value="to right">Left to Right (→)</option>
                            <option value="to left">Right to Left (←)</option>
                            <option value="to bottom">Top to Bottom (↓)</option>
                            <option value="to bottom right">Diagonal (↘)</option>
                        </select>
                    </div>
                </div>

                {/* Preview */}
                {settings.enable_gradients && (
                    <div className="mt-6 p-4 rounded-xl text-white font-bold text-center shadow-lg"
                        style={{ background: `linear-gradient(${settings.primary_gradient_direction}, ${settings.primary_gradient_start}, ${settings.primary_gradient_end})` }}
                    >
                        Gradient Preview
                    </div>
                )}
            </section>

            {/* 3. Typography */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <ALargeSmall className="text-blue-500" size={20} /> Typography System
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">Font Family</label>
                        <select
                            value={settings.font_family}
                            onChange={(e) => handleChange('font_family', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm"
                        >
                            <optgroup label="Sans Serif">
                                <option value="Inter">Inter (Modern & Clean)</option>
                                <option value="Roboto">Roboto (Android Default)</option>
                                <option value="Open Sans">Open Sans (Neutral)</option>
                                <option value="Montserrat">Montserrat (Geometric)</option>
                                <option value="Lato">Lato (Friendly)</option>
                                <option value="Poppins">Poppins (Geometric)</option>
                            </optgroup>
                            <optgroup label="Serif">
                                <option value="Merriweather">Merriweather (Readability)</option>
                                <option value="Playfair Display">Playfair Display (Elegant)</option>
                                <option value="Lora">Lora (Contemporary)</option>
                            </optgroup>
                            <optgroup label="Display">
                                <option value="Oswald">Oswald (Bold)</option>
                                <option value="Raleway">Raleway (Elegant)</option>
                            </optgroup>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">Base Size (px)</label>
                        <input
                            type="number"
                            value={settings.font_base_size}
                            onChange={(e) => handleChange('font_base_size', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">Font Weight (Base)</label>
                        <select
                            value={settings.font_weight_base}
                            onChange={(e) => handleChange('font_weight_base', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm"
                        >
                            <option value="300">Light (300)</option>
                            <option value="400">Regular (400)</option>
                            <option value="500">Medium (500)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">Font Weight (Heading)</label>
                        <select
                            value={settings.font_weight_heading}
                            onChange={(e) => handleChange('font_weight_heading', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm"
                        >
                            <option value="600">SemiBold (600)</option>
                            <option value="700">Bold (700)</option>
                            <option value="800">ExtraBold (800)</option>
                            <option value="900">Black (900)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">Heading Line Height</label>
                        <input
                            type="number" step="0.1"
                            value={settings.line_height}
                            onChange={(e) => handleChange('line_height', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm"
                        />
                    </div>
                </div>
            </section>

            {/* 4. Layout & Spacing */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Grid className="text-orange-500" size={20} /> Layout & Spacing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">Layout Mode</label>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            {['boxed', 'full', 'fluid'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => handleChange('layout_mode', mode)}
                                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md capitalize transition ${settings.layout_mode === mode ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">Container Width</label>
                        <select
                            value={settings.container_width}
                            onChange={(e) => handleChange('container_width', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm"
                            disabled={settings.layout_mode === 'full'}
                        >
                            <option value="1024px">Compact (1024px)</option>
                            <option value="1140px">Laptop (1140px)</option>
                            <option value="1280px">Standard (1280px)</option>
                            <option value="1440px">Wide (1440px)</option>
                            <option value="1600px">Ultra Wide (1600px)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">Border Radius</label>
                        <select
                            value={settings.border_radius}
                            onChange={(e) => handleChange('border_radius', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm"
                        >
                            <option value="0">None (Sharp)</option>
                            <option value="0.25rem">Small (4px)</option>
                            <option value="0.5rem">Medium (8px)</option>
                            <option value="0.75rem">Large (12px)</option>
                            <option value="1rem">Extra Large (16px)</option>
                            <option value="999px">Pill / Rounded</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">Section Spacing</label>
                        <input
                            type="text"
                            value={settings.spacing_section_gap}
                            onChange={(e) => handleChange('spacing_section_gap', e.target.value)}
                            placeholder="e.g. 4rem"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm"
                        />
                    </div>
                </div>
            </section>

            {/* 5. Effects */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Move className="text-teal-500" size={20} /> Effects & Shadows
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">Shadow Style</label>
                        <select
                            value={settings.shadow_style}
                            onChange={(e) => handleChange('shadow_style', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm"
                        >
                            <option value="none">Flat (No Shadow)</option>
                            <option value="soft">Soft (Diffuse)</option>
                            <option value="medium">Medium (Balanced)</option>
                            <option value="hard">Hard (Sharp)</option>
                            <option value="colored">Colored (Glow)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">Shadow Intensity</label>
                        <input
                            type="range" min="0" max="1" step="0.1"
                            value={settings.shadow_opacity}
                            onChange={(e) => handleChange('shadow_opacity', e.target.value)}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                            <span>Light</span>
                            <span>{settings.shadow_opacity}</span>
                            <span>Dark</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-[10px] font-bold uppercase mb-1">Page Transitions</label>
                        <select
                            value={settings.animation_style}
                            onChange={(e) => handleChange('animation_style', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm"
                        >
                            <option value="none">None</option>
                            <option value="fade">Fade In</option>
                            <option value="slide">Slide & Fade</option>
                            <option value="scale">Scale Up</option>
                            <option value="blur">Blur In</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Save Button Floating */}
            <div className="fixed bottom-6 right-6 z-50">
                <button onClick={handleSave} className="bg-blue-600 text-white px-8 py-4 rounded-full shadow-2xl shadow-blue-600/30 font-bold hover:bg-blue-700 hover:scale-105 transition flex items-center gap-3">
                    <RefreshCw size={20} /> Save Global Theme
                </button>
            </div>
        </div>
    );
};

export default GlobalTheme;
