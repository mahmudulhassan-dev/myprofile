import React, { useState, useEffect } from 'react';
import {
    Layout, Image, Menu, Type, MousePointer, Save, Plus, Trash2,
    ChevronRight, ChevronDown, GripVertical, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

const HeaderManager = () => {
    const [settings, setSettings] = useState({});
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('menu'); // menu, logo, style, cta

    useEffect(() => {
        fetchHeaderData();
    }, []);

    const fetchHeaderData = async () => {
        try {
            const res = await fetch('/api/header');
            const data = await res.json();
            setSettings(data.settings || {});
            setMenuItems(data.menu || []);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load header data');
            setLoading(false);
        }
    };

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const saveSettings = async () => {
        try {
            await fetch('/api/header/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings })
            });
            toast.success('Settings saved');
        } catch (error) {
            toast.error('Failed to save settings');
        }
    };

    const handleAddMenuItem = async () => {
        const title = prompt('Menu Title:');
        if (!title) return;

        try {
            const res = await fetch('/api/header/menu/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, url: '#', parentId: null, order: menuItems.length })
            });
            if (res.ok) {
                fetchHeaderData();
                toast.success('Item added');
            }
        } catch (error) {
            toast.error('Failed to add item');
        }
    };

    const handleDeleteMenuItem = async (id) => {
        if (!window.confirm('Delete this item?')) return;
        try {
            await fetch(`/api/header/menu/${id}`, { method: 'DELETE' });
            fetchHeaderData();
            toast.success('Item deleted');
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const handleUpdateMenuItem = async (id, data) => {
        try {
            await fetch(`/api/header/menu/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            fetchHeaderData();
            toast.success('Item updated');
        } catch (error) {
            toast.error('Failed to update');
        }
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            handleSettingChange(key, data.url);
            toast.success('Uploaded');
        } catch (error) {
            toast.error('Upload failed');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Layout className="text-blue-600" /> Header Manager
                    </h2>
                    <p className="text-slate-500">Configure your website's navigation and identity.</p>
                </div>
                <button onClick={saveSettings} className="bg-slate-900 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition">
                    <Save size={18} /> Save Config
                </button>
            </div>

            <div className="flex gap-1 bg-white p-1 rounded-xl w-fit shadow-sm border border-slate-100">
                {[
                    { id: 'menu', label: 'Menu Builder', icon: Menu },
                    { id: 'logo', label: 'Logo & Identity', icon: Image },
                    { id: 'style', label: 'Style & Layout', icon: Type },
                    { id: 'cta', label: 'CTA Button', icon: MousePointer },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-[400px]">
                {loading ? <div className="text-center py-20 text-slate-400">Loading Header Data...</div> : (
                    <>
                        {/* 1. Menu Builder */}
                        {activeTab === 'menu' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-slate-700">Navigation Structure</h3>
                                    <button onClick={handleAddMenuItem} className="text-blue-600 font-bold text-xs flex items-center gap-1 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition">
                                        <Plus size={16} /> Add Top Level Item
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {menuItems
                                        .sort((a, b) => a.order - b.order)
                                        .filter(i => !i.parentId)
                                        .map((item, index) => (
                                            <div
                                                key={item.id}
                                                draggable
                                                onDragStart={(e) => e.dataTransfer.setData('text/plain', index)}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={async (e) => {
                                                    e.preventDefault();
                                                    const draggedIdx = Number(e.dataTransfer.getData('text/plain'));
                                                    const targetIdx = index;
                                                    if (draggedIdx === targetIdx) return;

                                                    // Get current display order
                                                    const siblings = menuItems.filter(i => !i.parentId).sort((a, b) => a.order - b.order);

                                                    const [draggedItem] = siblings.splice(draggedIdx, 1);
                                                    siblings.splice(targetIdx, 0, draggedItem);

                                                    // Re-index
                                                    const updatedSiblings = siblings.map((s, i) => ({ ...s, order: i }));

                                                    // Merge back
                                                    const finalItems = menuItems.map(m => {
                                                        const updated = updatedSiblings.find(s => s.id === m.id);
                                                        return updated ? updated : m;
                                                    });

                                                    setMenuItems(finalItems);

                                                    // Persist
                                                    await fetch('/api/header/menu/update-order', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ items: updatedSiblings.map(s => ({ id: s.id, order: s.order, parentId: null })) })
                                                    });
                                                    toast.success('Order updated');
                                                }}
                                                className="border border-slate-200 rounded-xl p-4 bg-slate-50 group transition-all hover:shadow-md cursor-grab active:cursor-grabbing"
                                            >
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <GripVertical className="text-slate-400" size={18} />
                                                        <div className="flex-1 grid grid-cols-2 gap-4">
                                                            <input
                                                                value={item.title}
                                                                onChange={(e) => handleUpdateMenuItem(item.id, { title: e.target.value })}
                                                                className="bg-white border border-slate-200 px-3 py-1.5 rounded text-sm font-bold text-slate-700 outline-none focus:border-blue-500"
                                                            />
                                                            <input
                                                                value={item.url}
                                                                onChange={(e) => handleUpdateMenuItem(item.id, { url: e.target.value })}
                                                                className="bg-white border border-slate-200 px-3 py-1.5 rounded text-xs font-mono text-slate-500 outline-none focus:border-blue-500"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleUpdateMenuItem(item.id, { isOpenNewTab: !item.isOpenNewTab })}
                                                            title="Open in New Tab"
                                                            className={`p-2 rounded hover:bg-slate-200 ${item.isOpenNewTab ? 'text-blue-600 bg-blue-100' : 'text-slate-400'}`}
                                                        >
                                                            <ExternalLink size={16} />
                                                        </button>
                                                        <button onClick={() => handleDeleteMenuItem(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition"><Trash2 size={16} /></button>
                                                    </div>
                                                </div>

                                                {/* Subitems */}
                                                <div className="pl-10 mt-3 space-y-2">
                                                    {menuItems.filter(sub => sub.parentId === item.id).sort((a, b) => a.order - b.order).map(sub => (
                                                        <div key={sub.id} className="flex items-center gap-3 bg-white p-2 rounded border border-slate-200">
                                                            <ChevronRight size={14} className="text-slate-300" />
                                                            <input
                                                                value={sub.title}
                                                                onChange={(e) => handleUpdateMenuItem(sub.id, { title: e.target.value })}
                                                                className="bg-transparent border-b border-transparent focus:border-blue-500 outline-none text-sm w-32"
                                                            />
                                                            <input
                                                                value={sub.url}
                                                                onChange={(e) => handleUpdateMenuItem(sub.id, { url: e.target.value })}
                                                                className="bg-transparent border-b border-transparent focus:border-blue-500 outline-none text-xs text-slate-500 font-mono flex-1"
                                                            />
                                                            <button onClick={() => handleDeleteMenuItem(sub.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={async () => {
                                                            const title = prompt('Submenu Title:');
                                                            if (title) {
                                                                await fetch('/api/header/menu/add', {
                                                                    method: 'POST',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ title, url: '#', parentId: item.id, order: 99 })
                                                                });
                                                                fetchHeaderData();
                                                            }
                                                        }}
                                                        className="text-xs text-blue-500 font-medium hover:underline flex items-center gap-1 mt-2"
                                                    >
                                                        <Plus size={12} /> Add Submenu Item
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* 2. Logo Settings */}
                        {activeTab === 'logo' && (
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Upload Logo</label>
                                    <input type="file" onChange={(e) => handleFileUpload(e, 'logo_url')} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                    {settings.logo_url && (
                                        <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                            <p className="text-xs text-slate-400 mb-2 uppercase font-bold">Preview</p>
                                            <img src={settings.logo_url} alt="Logo Preview" className="h-12 object-contain" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Alt Text</label>
                                        <input value={settings.logo_alt || ''} onChange={(e) => handleSettingChange('logo_alt', e.target.value)} className="input-field" placeholder="My Website Logo" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Width (px)</label>
                                            <input type="number" value={settings.logo_width || ''} onChange={(e) => handleSettingChange('logo_width', e.target.value)} className="input-field" placeholder="e.g. 150" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Height (px)</label>
                                            <input type="number" value={settings.logo_height || ''} onChange={(e) => handleSettingChange('logo_height', e.target.value)} className="input-field" placeholder="e.g. 40" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. Style Settings */}
                        {activeTab === 'style' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Header Style</label>
                                    <select value={settings.header_style || 'classic'} onChange={(e) => handleSettingChange('header_style', e.target.value)} className="input-field">
                                        <option value="classic">Classic (Logo Left, Menu Right)</option>
                                        <option value="minimal">Minimal (Hamburger Menu)</option>
                                        <option value="center">Center Logo</option>
                                        <option value="mega">Mega Menu Layout</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Background Color</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={settings.header_bg_color || '#ffffff'} onChange={(e) => handleSettingChange('header_bg_color', e.target.value)} className="h-10 w-20 rounded border border-slate-200 cursor-pointer" />
                                        <input type="text" value={settings.header_bg_color || '#ffffff'} onChange={(e) => handleSettingChange('header_bg_color', e.target.value)} className="input-field" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                                    <span className="font-bold text-slate-700">Sticky Header</span>
                                    <input type="checkbox" checked={settings.header_sticky === 'true'} onChange={(e) => handleSettingChange('header_sticky', String(e.target.checked))} className="toggle" />
                                </div>
                                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                                    <span className="font-bold text-slate-700">Transparent Header</span>
                                    <input type="checkbox" checked={settings.header_transparent === 'true'} onChange={(e) => handleSettingChange('header_transparent', String(e.target.checked))} className="toggle" />
                                </div>
                            </div>
                        )}

                        {/* 4. CTA Button */}
                        {activeTab === 'cta' && (
                            <div className="space-y-6 max-w-lg">
                                <div className="flex items-center gap-4">
                                    <input type="checkbox" checked={settings.header_cta_enabled === 'true'} onChange={(e) => handleSettingChange('header_cta_enabled', String(e.target.checked))} className="w-5 h-5" />
                                    <span className="font-bold text-slate-700">Enable Header CTA Button</span>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Button Text</label>
                                    <input value={settings.header_cta_text || ''} onChange={(e) => handleSettingChange('header_cta_text', e.target.value)} className="input-field" placeholder="Get Started" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Button URL</label>
                                    <input value={settings.header_cta_url || ''} onChange={(e) => handleSettingChange('header_cta_url', e.target.value)} className="input-field" placeholder="https://..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Button Color</label>
                                        <input type="color" value={settings.header_cta_bg || '#2563eb'} onChange={(e) => handleSettingChange('header_cta_bg', e.target.value)} className="h-10 w-full rounded border border-slate-200 cursor-pointer" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Text Color</label>
                                        <input type="color" value={settings.header_cta_text_color || '#ffffff'} onChange={(e) => handleSettingChange('header_cta_text_color', e.target.value)} className="h-10 w-full rounded border border-slate-200 cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            <style>{`
                .input-field {
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: 0.75rem;
                    border: 1px solid #e2e8f0;
                    outline: none;
                    font-size: 0.875rem;
                    color: #334155;
                    transition: border-color 0.2s;
                }
                .input-field:focus {
                    border-color: #3b82f6;
                }
            `}</style>
        </div>
    );
};

export default HeaderManager;
