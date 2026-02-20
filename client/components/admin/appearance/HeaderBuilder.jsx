import React, { useState, useEffect } from 'react';
import { Layout, Menu, Search, User, ShoppingCart, Heart, Globe, DollarSign, ArrowUp, Save, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const HeaderBuilder = () => {
    const [settings, setSettings] = useState({
        header_layout: 'left-logo', // left-logo, centered, full-width, minimal
        header_sticky: true,
        header_transparent: false,
        header_height: '80',
        header_bg_color: '#ffffff',
        header_border_bottom: true,

        // Header Elements
        header_show_search: true,
        header_show_auth: true,
        header_show_cart: true,
        header_show_wishlist: false,
        header_show_language: false,
        header_show_currency: false,
    });

    // Mock Menu Data for now (Real implementation needs DB fetch)
    const [menuItems, setMenuItems] = useState([
        { id: 1, title: 'Home', url: '/', type: 'link' },
        { id: 2, title: 'Shop', url: '/shop', type: 'dropdown' },
        { id: 3, title: 'About', url: '/about', type: 'link' },
        { id: 4, title: 'Contact', url: '/contact', type: 'link' },
    ]);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/appearance/theme');
            const data = await res.json();
            if (Object.keys(data).length > 0) {
                // Filter out irrelevant keys if needed, or just merge
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
        const toastId = toast.loading('Saving header settings...');
        try {
            await fetch('/api/appearance/theme', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            toast.success('Header updated!', { id: toastId });
        } catch (error) {
            toast.error('Failed to save', { id: toastId });
        }
    };

    const LayoutOption = ({ id, label, icon }) => (
        <button
            onClick={() => handleChange('header_layout', id)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${settings.header_layout === id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-100 bg-white hover:border-slate-200 text-slate-600'
                }`}
        >
            <div className={`w-full h-12 bg-slate-200 rounded mb-3 overflow-hidden opacity-50 ${settings.header_layout === id && 'bg-blue-200'}`}>
                {/* Visual Representation */}
                {id === 'centered' && <div className="flex items-center justify-center h-full gap-2"><div className="w-10 h-2 bg-slate-400 rounded"></div></div>}
                {id === 'left-logo' && <div className="flex items-center justify-between px-2 h-full"><div className="w-4 h-4 bg-slate-400 rounded-full"></div><div className="w-10 h-2 bg-slate-300 rounded"></div></div>}
                {id === 'full-width' && <div className="flex items-center justify-between px-1 h-full"><div className="w-3 h-3 bg-slate-400 rounded-full"></div><div className="flex-1 mx-2 h-1 bg-slate-300 rounded"></div></div>}
            </div>
            <span className="font-medium text-sm">{label}</span>
        </button>
    );

    const ToggleItem = ({ id, label, icon: Icon, checked }) => (
        <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                    <Icon size={18} />
                </div>
                <span className="font-medium text-slate-700">{label}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={checked} onChange={(e) => handleChange(id, e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto pb-20 space-y-8 animate-fade-in">

            {/* Layout */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Layout className="text-blue-500" size={20} /> Header Layout
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <LayoutOption id="left-logo" label="Standard (Left Logo)" />
                    <LayoutOption id="centered" label="Centered Logo" />
                    <LayoutOption id="full-width" label="Full Width" />
                    <LayoutOption id="minimal" label="Minimal (No Menu)" />
                </div>
            </section>

            {/* Style & Behavior */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <ArrowUp className="text-purple-500" size={20} /> Behavior & Style
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Header Height (px)</label>
                        <input
                            type="number"
                            value={settings.header_height}
                            onChange={(e) => handleChange('header_height', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Background Color</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="color"
                                value={settings.header_bg_color}
                                onChange={(e) => handleChange('header_bg_color', e.target.value)}
                                className="h-11 w-11 rounded cursor-pointer border border-slate-200"
                            />
                            <input
                                type="text"
                                value={settings.header_bg_color}
                                onChange={(e) => handleChange('header_bg_color', e.target.value)}
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col justify-center space-y-4 pt-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.header_sticky}
                                onChange={(e) => handleChange('header_sticky', e.target.checked)}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-slate-700 font-medium">Sticky Header</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.header_transparent}
                                onChange={(e) => handleChange('header_transparent', e.target.checked)}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-slate-700 font-medium">Transparent Background</span>
                        </label>
                    </div>
                </div>
            </section>

            {/* Elements */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Menu className="text-orange-500" size={20} /> Header Elements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ToggleItem id="header_show_search" label="Search Bar" icon={Search} checked={settings.header_show_search} />
                    <ToggleItem id="header_show_auth" label="Login / Signup" icon={User} checked={settings.header_show_auth} />
                    <ToggleItem id="header_show_cart" label="Shopping Cart" icon={ShoppingCart} checked={settings.header_show_cart} />
                    <ToggleItem id="header_show_wishlist" label="Wishlist" icon={Heart} checked={settings.header_show_wishlist} />
                    <ToggleItem id="header_show_language" label="Language Switcher" icon={Globe} checked={settings.header_show_language} />
                    <ToggleItem id="header_show_currency" label="Currency Switcher" icon={DollarSign} checked={settings.header_show_currency} />
                </div>
            </section>

            {/* Menu Manager Mockup */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm opacity-60 pointer-events-none relative">
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
                        Menu Builder Coming Soon
                    </div>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Menu className="text-slate-500" size={20} /> Main Menu
                </h3>
                <div className="space-y-2">
                    {menuItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <span className="font-medium text-slate-700">{item.title}</span>
                            <div className="flex gap-2 text-xs text-slate-500">
                                <span>{item.url}</span>
                            </div>
                        </div>
                    ))}
                    <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 font-medium flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition">
                        <Plus size={16} /> Add Menu Item
                    </button>
                </div>
            </section>

            {/* Save Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-4 rounded-full shadow-xl shadow-blue-500/30 font-bold hover:bg-blue-700 hover:scale-105 transition flex items-center gap-2">
                    <Save size={20} /> Save Header
                </button>
            </div>
        </div>
    );
};

export default HeaderBuilder;
