import React from 'react';
import { Layout, Columns, PanelLeft, PanelRight, Maximize2, Minimize2, Box, Move } from 'lucide-react';

const LayoutSettings = ({ settings, handleChange }) => {

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

    const layoutTypes = [
        { id: 'full-width', icon: Maximize2, label: 'Full Width', desc: 'Edge-to-edge content' },
        { id: 'boxed', icon: Box, label: 'Boxed', desc: 'Centered container' },
        { id: 'wide', icon: Columns, label: 'Wide', desc: 'Large centered container' },
    ];

    const headerStyles = [
        { id: 'classic', label: 'Classic', desc: 'Logo left, menu right' },
        { id: 'centered', label: 'Centered', desc: 'Logo centered' },
        { id: 'minimal', label: 'Minimal', desc: 'Hamburger only' },
        { id: 'transparent', label: 'Transparent', desc: 'Over hero content' },
    ];

    const sidebarPositions = [
        { id: 'left', icon: PanelLeft, label: 'Left' },
        { id: 'right', icon: PanelRight, label: 'Right' },
    ];

    const containerWidths = [
        { value: '1024', label: '1024px (Compact)' },
        { value: '1280', label: '1280px (Default)' },
        { value: '1440', label: '1440px (Wide)' },
        { value: '1600', label: '1600px (Extra Wide)' },
        { value: '100%', label: 'Full Width' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Layout Type */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Layout className="text-blue-500" size={20} /> Page Layout
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {layoutTypes.map(type => (
                        <button
                            key={type.id}
                            onClick={() => handleChange('layout_type', type.id)}
                            className={`p-5 rounded-xl border-2 text-left transition-all ${settings.layout_type === type.id
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <type.icon size={28} className={settings.layout_type === type.id ? 'text-blue-600' : 'text-slate-400'} />
                            <h4 className="font-bold text-slate-800 mt-3">{type.label}</h4>
                            <p className="text-xs text-slate-500">{type.desc}</p>
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Container Max Width</label>
                        <select
                            value={settings.container_max_width || '1280'}
                            onChange={(e) => handleChange('container_max_width', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            {containerWidths.map(w => (
                                <option key={w.value} value={w.value}>{w.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Page Padding</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="0"
                                max="64"
                                step="8"
                                value={settings.page_padding || 32}
                                onChange={(e) => handleChange('page_padding', e.target.value)}
                                className="flex-1 accent-blue-600"
                            />
                            <span className="text-sm font-mono text-slate-600 w-16 text-right">{settings.page_padding || 32}px</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Header Options */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Columns className="text-purple-500" size={20} /> Header Style
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {headerStyles.map(style => (
                        <button
                            key={style.id}
                            onClick={() => handleChange('header_style', style.id)}
                            className={`p-4 rounded-xl border-2 text-center transition ${settings.header_style === style.id
                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                        >
                            <span className="text-sm font-bold">{style.label}</span>
                            <p className="text-xs text-slate-400 mt-1">{style.desc}</p>
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ToggleSwitch label="Sticky Header" description="Header stays fixed on scroll" settingKey="sticky_header" />
                    <ToggleSwitch label="Header Top Bar" description="Show announcement bar above header" settingKey="header_top_bar" />
                    <ToggleSwitch label="Header Search" description="Show search icon in header" settingKey="header_search" />
                    <ToggleSwitch label="Header Cart Icon" description="Show cart icon for ecommerce" settingKey="header_cart" />
                </div>
            </section>

            {/* Sidebar Settings */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <PanelLeft className="text-green-500" size={20} /> Sidebar Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-3">Sidebar Position</label>
                        <div className="flex gap-4">
                            {sidebarPositions.map(pos => (
                                <button
                                    key={pos.id}
                                    onClick={() => handleChange('sidebar_position', pos.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition ${settings.sidebar_position === pos.id
                                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                        }`}
                                >
                                    <pos.icon size={20} />
                                    <span className="font-medium">{pos.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-3">Sidebar Width</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="200"
                                max="400"
                                step="20"
                                value={settings.sidebar_width || 280}
                                onChange={(e) => handleChange('sidebar_width', e.target.value)}
                                className="flex-1 accent-blue-600"
                            />
                            <span className="text-sm font-mono text-slate-600 w-16 text-right">{settings.sidebar_width || 280}px</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ToggleSwitch label="Collapsible Sidebar" description="Allow users to collapse sidebar" settingKey="sidebar_collapsible" />
                    <ToggleSwitch label="Default Collapsed" description="Start with sidebar collapsed" settingKey="sidebar_default_collapsed" />
                </div>
            </section>

            {/* Footer Layout */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Move className="text-amber-500" size={20} /> Footer Layout
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {['4-column', '3-column', '2-column', 'minimal'].map(layout => (
                        <button
                            key={layout}
                            onClick={() => handleChange('footer_column_layout', layout)}
                            className={`p-4 rounded-xl border-2 text-center transition ${settings.footer_column_layout === layout
                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                        >
                            <Columns size={24} className="mx-auto mb-2" />
                            <span className="text-sm font-bold capitalize">{layout}</span>
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ToggleSwitch label="Show Footer Logo" description="Display logo in footer" settingKey="footer_show_logo" />
                    <ToggleSwitch label="Back to Top Button" description="Show scroll-to-top button" settingKey="back_to_top" />
                </div>
            </section>
        </div>
    );
};

export default LayoutSettings;
