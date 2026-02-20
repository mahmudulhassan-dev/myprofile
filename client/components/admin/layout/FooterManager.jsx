import React, { useState, useEffect } from 'react';
import {
    Layout, Link2, Share2, Mail, Plus, Trash2, Save, GripVertical,
    Columns, Type, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

const FooterManager = () => {
    const [settings, setSettings] = useState({});
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('layout'); // layout, sections, social, newsletter

    useEffect(() => {
        fetchFooterData();
    }, []);

    const fetchFooterData = async () => {
        try {
            const res = await fetch('/api/footer');
            const data = await res.json();
            setSettings(data.settings || {});
            setSections(data.sections || []);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load footer data');
            setLoading(false);
        }
    };

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const saveSettings = async () => {
        try {
            await fetch('/api/footer/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings })
            });
            toast.success('Settings saved');
        } catch (error) {
            toast.error('Failed to save settings');
        }
    };

    const handleAddSection = async () => {
        const title = prompt('Section Title:');
        if (!title) return;

        try {
            const res = await fetch('/api/footer/section/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    type: 'links',
                    content: '[]',
                    order: sections.length
                })
            });
            if (res.ok) {
                fetchFooterData();
                toast.success('Section added');
            }
        } catch (error) {
            toast.error('Failed to add section');
        }
    };

    const handleDeleteSection = async (id) => {
        if (!window.confirm('Delete this section?')) return;
        try {
            await fetch(`/api/footer/section/${id}`, { method: 'DELETE' });
            fetchFooterData();
            toast.success('Section deleted');
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const handleUpdateSection = async (id, data) => {
        try {
            await fetch(`/api/footer/section/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            fetchFooterData();
            toast.success('Section updated');
        } catch (error) {
            toast.error('Failed to update');
        }
    };

    // Helper to parse/stringify content for different types
    const parseContent = (content, type) => {
        if (type === 'html' || type === 'text') return content;
        try { return JSON.parse(content || '[]'); } catch { return []; }
    };

    const handleLinksUpdate = (sectionId, links) => {
        handleUpdateSection(sectionId, { content: JSON.stringify(links) });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Columns className="text-blue-600" /> Footer Manager
                    </h2>
                    <p className="text-slate-500">Customize your website's footer area.</p>
                </div>
                <button onClick={saveSettings} className="bg-slate-900 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition">
                    <Save size={18} /> Save Config
                </button>
            </div>

            <div className="flex gap-1 bg-white p-1 rounded-xl w-fit shadow-sm border border-slate-100">
                {[
                    { id: 'layout', label: 'Layout & Style', icon: Layout },
                    { id: 'sections', label: 'Sections Builder', icon: FileText },
                    { id: 'social', label: 'Social Icons', icon: Share2 },
                    { id: 'newsletter', label: 'Newsletter Box', icon: Mail },
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
                {loading ? <div className="text-center py-20 text-slate-400">Loading Footer Data...</div> : (
                    <>
                        {/* 1. Layout Settings */}
                        {activeTab === 'layout' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Column Layout</label>
                                    <div className="flex gap-4">
                                        {['4-col', '3-col', '2-col', 'minimal'].map(layout => (
                                            <button
                                                key={layout}
                                                onClick={() => handleSettingChange('footer_layout', layout)}
                                                className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition ${settings.footer_layout === layout ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:bg-slate-50'}`}
                                            >
                                                <Columns size={24} />
                                                <span className="text-xs font-bold uppercase">{layout}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Background Color</label>
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={settings.footer_bg_color || '#1e293b'} onChange={(e) => handleSettingChange('footer_bg_color', e.target.value)} className="h-10 w-20 rounded border border-slate-200 cursor-pointer" />
                                            <input type="text" value={settings.footer_bg_color || '#1e293b'} onChange={(e) => handleSettingChange('footer_bg_color', e.target.value)} className="input-field" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Text Color</label>
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={settings.footer_text_color || '#ffffff'} onChange={(e) => handleSettingChange('footer_text_color', e.target.value)} className="h-10 w-20 rounded border border-slate-200 cursor-pointer" />
                                            <input type="text" value={settings.footer_text_color || '#ffffff'} onChange={(e) => handleSettingChange('footer_text_color', e.target.value)} className="input-field" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. Sections Builder */}
                        {activeTab === 'sections' && (
                            <div className="space-y-6">
                                <button onClick={handleAddSection} className="flex items-center gap-2 text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition">
                                    <Plus size={18} /> Add New Section
                                </button>

                                <div className="grid gap-6">
                                    {sections.sort((a, b) => a.order - b.order).map((section, index) => (
                                        <div
                                            key={section.id}
                                            draggable
                                            onDragStart={(e) => e.dataTransfer.setData('text/plain', index)}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={async (e) => {
                                                e.preventDefault();
                                                const draggedIdx = Number(e.dataTransfer.getData('text/plain'));
                                                const targetIdx = index;
                                                if (draggedIdx === targetIdx) return;

                                                const newSections = [...sections];
                                                // Sort first to ensure index matches order
                                                newSections.sort((a, b) => a.order - b.order);

                                                const [draggedItem] = newSections.splice(draggedIdx, 1);
                                                newSections.splice(targetIdx, 0, draggedItem);

                                                // Re-index
                                                const updated = newSections.map((s, i) => ({ ...s, order: i }));
                                                setSections(updated);

                                                // Save to DB
                                                await fetch('/api/footer/section/update-order', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ items: updated.map(s => ({ id: s.id, order: s.order })) })
                                                });
                                                toast.success('Order updated');
                                            }}
                                            className="border border-slate-200 rounded-xl p-5 bg-slate-50 transition-all hover:shadow-md"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="cursor-move p-2 hover:bg-slate-200 rounded" title="Drag to reorder">
                                                        <GripVertical className="text-slate-400" />
                                                    </div>
                                                    <input
                                                        value={section.title}
                                                        onChange={(e) => handleUpdateSection(section.id, { title: e.target.value })}
                                                        className="font-bold text-lg bg-transparent outline-none focus:border-b border-blue-500 w-64"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <select
                                                        value={section.type}
                                                        onChange={(e) => handleUpdateSection(section.id, { type: e.target.value })}
                                                        className="bg-white border text-xs px-2 py-1 rounded"
                                                    >
                                                        <option value="links">Links List</option>
                                                        <option value="text">Text / Description</option>
                                                        <option value="html">Custom HTML</option>
                                                    </select>
                                                    <button onClick={() => handleDeleteSection(section.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                                                </div>
                                            </div>

                                            {/* Section Content Logic */}
                                            {section.type === 'links' && (
                                                <div className="pl-8 space-y-2">
                                                    {parseContent(section.content, 'links').map((link, idx) => (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            <input
                                                                value={link.label}
                                                                onChange={(e) => {
                                                                    const newLinks = [...parseContent(section.content, 'links')];
                                                                    newLinks[idx].label = e.target.value;
                                                                    handleLinksUpdate(section.id, newLinks);
                                                                }}
                                                                placeholder="Link Label"
                                                                className="input-sm flex-1"
                                                            />
                                                            <input
                                                                value={link.url}
                                                                onChange={(e) => {
                                                                    const newLinks = [...parseContent(section.content, 'links')];
                                                                    newLinks[idx].url = e.target.value;
                                                                    handleLinksUpdate(section.id, newLinks);
                                                                }}
                                                                placeholder="URL"
                                                                className="input-sm flex-1 font-mono text-xs"
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    const newLinks = parseContent(section.content, 'links').filter((_, i) => i !== idx);
                                                                    handleLinksUpdate(section.id, newLinks);
                                                                }}
                                                                className="text-red-400 hover:text-red-600"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={() => {
                                                            const newLinks = [...parseContent(section.content, 'links'), { label: '', url: '#' }];
                                                            handleLinksUpdate(section.id, newLinks);
                                                        }}
                                                        className="text-xs text-blue-600 font-medium flex items-center gap-1 mt-2"
                                                    >
                                                        <Plus size={12} /> Add Link
                                                    </button>
                                                </div>
                                            )}

                                            {(section.type === 'text' || section.type === 'html') && (
                                                <div className="pl-8 mt-2">
                                                    <textarea
                                                        value={section.content || ''}
                                                        onChange={(e) => handleUpdateSection(section.id, { content: e.target.value })}
                                                        className="w-full h-32 p-3 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-mono"
                                                        placeholder={section.type === 'html' ? "<div>Custom HTML...</div>" : "Enter text here..."}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 3. Social Icons */}
                        {activeTab === 'social' && (
                            <div className="max-w-2xl">
                                <div className="p-6 border border-slate-200 rounded-xl bg-slate-50 text-center text-slate-500">
                                    <Share2 size={32} className="mx-auto mb-2 text-slate-300" />
                                    <p>Social Icons are currently managed in <b>Global Settings &gt; Social Media</b>.</p>
                                    <p className="text-sm mt-2">The footer will automatically pull enabled platforms from there.</p>
                                </div>
                            </div>
                        )}

                        {/* 4. Newsletter */}
                        {activeTab === 'newsletter' && (
                            <div className="space-y-6 max-w-lg">
                                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                                    <span className="font-bold text-slate-700">Enable Newsletter Box</span>
                                    <input type="checkbox" checked={settings.footer_newsletter_enabled === 'true'} onChange={(e) => handleSettingChange('footer_newsletter_enabled', String(e.target.checked))} className="toggle" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Heading</label>
                                    <input value={settings.footer_newsletter_title || ''} onChange={(e) => handleSettingChange('footer_newsletter_title', e.target.value)} className="input-field" placeholder="Subscribe to our newsletter" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                    <textarea value={settings.footer_newsletter_desc || ''} onChange={(e) => handleSettingChange('footer_newsletter_desc', e.target.value)} className="input-field h-24" placeholder="Get the latest updates..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Button Text</label>
                                    <input value={settings.footer_newsletter_btn || ''} onChange={(e) => handleSettingChange('footer_newsletter_btn', e.target.value)} className="input-field" placeholder="Subscribe" />
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
                    background: white;
                    color: #334155;
                    transition: border-color 0.2s;
                }
                .input-sm {
                    padding: 0.5rem;
                    border-radius: 0.5rem;
                    border: 1px solid #e2e8f0;
                    outline: none;
                    font-size: 0.875rem;
                }
                .input-field:focus, .input-sm:focus {
                    border-color: #3b82f6;
                }
                .toggle {
                    width: 1.25rem;
                    height: 1.25rem;
                    accent-color: #2563eb;
                }
            `}</style>
        </div>
    );
};

export default FooterManager;
