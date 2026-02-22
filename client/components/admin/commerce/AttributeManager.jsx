
import React, { useState, useEffect, useCallback } from 'react';
import {
    Tag as TagIcon, Plus, Edit, Trash2, X, Save,
    Search, RefreshCw, Layers, Palette, Code, Type
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const AttributeManager = () => {
    const [attributes, setAttributes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAttribute, setEditingAttribute] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({ name: '', slug: '', type: 'select', values: [] });
    const [termInput, setTermInput] = useState('');

    const fetchAttributes = useCallback(async () => {
        try {
            const res = await axios.get('/api/admin/attributes');
            setAttributes(res.data);
        } catch {
            toast.error('Attribute Sync Failed');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAttributes();
    }, [fetchAttributes]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTerm();
        }
    };

    const addTerm = () => {
        const trimmed = termInput.trim();
        if (!trimmed) return;
        if (formData.values.find(v => v.name.toLowerCase() === trimmed.toLowerCase())) {
            toast.error('Identity Conflict: Term Duplicate');
            return;
        }
        const newTerm = {
            name: trimmed,
            slug: trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        };
        setFormData({ ...formData, values: [...formData.values, newTerm] });
        setTermInput('');
    };

    const removeTerm = (slug) => {
        setFormData({ ...formData, values: formData.values.filter(v => v.slug !== slug) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingAttribute ? 'put' : 'post';
        const url = editingAttribute ? `/api/admin/attributes/${editingAttribute.id}` : '/api/admin/attributes';

        try {
            const res = await axios[method](url, formData);
            if (res.status === 200 || res.status === 201) {
                toast.success(editingAttribute ? 'Property Optimized' : 'Property Synchronized');
                fetchAttributes();
                closeModal();
            }
        } catch {
            toast.error('Protocol Overload: Update Failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Erase this property? This will de-link associated products.')) return;
        try {
            await axios.delete(`/api/admin/attributes/${id}`);
            toast.success('Property Decommissioned');
            fetchAttributes();
        } catch {
            toast.error('Decommission Failed');
        }
    };

    const openModal = (attr = null) => {
        if (attr) {
            setEditingAttribute(attr);
            setFormData({
                name: attr.name,
                slug: attr.slug,
                type: attr.type,
                values: attr.values || []
            });
        } else {
            setEditingAttribute(null);
            setFormData({ name: '', slug: '', type: 'select', values: [] });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAttribute(null);
        setTermInput('');
    };

    const filteredAttributes = attributes.filter(attr =>
        attr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attr.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-orange-500">
            <RefreshCw className="animate-spin" size={32} />
            <p className="animate-pulse tracking-widest text-xs uppercase font-bold">Accessing Property Registry...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Property Matrix</h1>
                    <p className="text-slate-500 font-medium flex items-center gap-2">
                        <Palette size={16} className="text-orange-500" />
                        Global Product Attributes & Variations
                    </p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search properties..."
                            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={18} /> New Property
                    </button>
                </div>
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredAttributes.map(attr => (
                        <motion.div
                            key={attr.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="aurora-glass-card group rounded-[2rem] border border-white/10 p-6 flex flex-col shadow-xl hover:shadow-2xl transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-orange-600 transition-colors">{attr.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{attr.type}</span>
                                        <span className="text-[10px] text-slate-400 font-mono tracking-tight">{attr.slug}</span>
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={() => openModal(attr)}
                                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(attr.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-100/50">
                                {attr.values?.length > 0 ? (
                                    <>
                                        {attr.values.slice(0, 5).map((val, i) => (
                                            <span key={i} className="text-[10px] bg-white/50 border border-slate-200 text-slate-600 px-2 py-1 rounded-lg font-bold">
                                                {val.name}
                                            </span>
                                        ))}
                                        {attr.values.length > 5 && (
                                            <span className="text-[10px] text-slate-400 font-bold px-1">+ {attr.values.length - 5}</span>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-[10px] text-slate-400 font-medium italic">Null Values</span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Modal */}
            <AnimatePresence mode="wait">
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={closeModal} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="aurora-glass-card w-full max-w-lg rounded-[2.5rem] border border-white/20 shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/10 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <div className="p-2 bg-orange-500/20 rounded-xl text-orange-400">
                                        <TagIcon size={20} />
                                    </div>
                                    {editingAttribute ? 'Property Optimization' : 'Initialization Sync'}
                                </h2>
                                <button onClick={closeModal} className="p-2 text-slate-400 hover:text-white transition-all"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">Name</label>
                                            <input
                                                type="text" required
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white outline-none focus:border-orange-500/50 transition-all font-medium"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">Data Type</label>
                                            <select
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white outline-none focus:border-orange-500/50 transition-all font-medium appearance-none"
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            >
                                                <option value="select" className="bg-slate-800 text-white">Dropdown</option>
                                                <option value="color" className="bg-slate-800 text-white">Chromatics</option>
                                                <option value="image" className="bg-slate-800 text-white">Visual Ref</option>
                                                <option value="button" className="bg-slate-800 text-white">Label Matrix</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">Identity Slug</label>
                                        <div className="relative">
                                            <Code className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                            <input
                                                type="text"
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-white/50 outline-none transition-all font-mono text-sm"
                                                disabled placeholder="auto-generated"
                                                value={formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">Property Nodes (Values)</label>
                                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3">
                                            <div className="flex flex-wrap gap-2">
                                                {formData.values.map((val, i) => (
                                                    <motion.span
                                                        key={i} layout
                                                        className="flex items-center gap-2 bg-orange-500/10 text-orange-400 px-3 py-1.5 rounded-xl text-xs font-bold border border-orange-500/20 group/tag"
                                                    >
                                                        {val.name}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTerm(val.slug)}
                                                            className="text-orange-500/50 hover:text-red-500 transition-all"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </motion.span>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    className="flex-1 bg-transparent border-0 outline-none text-white text-sm"
                                                    placeholder="Input node data..."
                                                    value={termInput}
                                                    onChange={(e) => setTermInput(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={addTerm}
                                                    className="text-orange-500 font-bold text-xs uppercase tracking-widest"
                                                >
                                                    Inject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button" onClick={closeModal}
                                        className="flex-1 px-6 py-4 rounded-2xl font-bold bg-white/5 text-slate-300 hover:bg-white/10 transition-all font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <Save size={18} /> Commit Sync
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AttributeManager;
