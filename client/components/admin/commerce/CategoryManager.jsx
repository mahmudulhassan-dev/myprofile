
import React, { useState, useEffect, useCallback } from 'react';
import {
    Layers, Plus, Edit, Trash2, ChevronRight,
    ChevronDown, Folder, Save, X, Search,
    RefreshCw, Image as ImageIcon, Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        name: '', parentId: '', description: '', icon: '', banner: ''
    });

    const fetchCategories = useCallback(async () => {
        try {
            const res = await axios.get('/api/admin/categories');
            setCategories(res.data);
        } catch {
            toast.error('Neural link failure: Categories inaccessible');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const buildTree = (cats, parentId = null) => {
        return cats
            .filter(cat => cat.parentId === parentId)
            .map(cat => ({
                ...cat,
                children: buildTree(cats, cat.id)
            }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingCategory ? 'put' : 'post';
        const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories';

        try {
            const res = await axios[method](url, {
                ...formData,
                parentId: formData.parentId ? parseInt(formData.parentId) : null
            });

            if (res.status === 200 || res.status === 201) {
                toast.success(editingCategory ? 'Category Protocol Updated' : 'New Category Initialized');
                fetchCategories();
                closeModal();
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Execution Error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Erase this category? Sub-nodes will be re-parented.')) return;
        try {
            await axios.delete(`/api/admin/categories/${id}`);
            toast.success('Category Purged');
            fetchCategories();
        } catch {
            toast.error('Purge Failed');
        }
    };

    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                parentId: category.parentId || '',
                description: category.description || '',
                icon: category.icon || '',
                banner: category.banner || ''
            });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', parentId: '', description: '', icon: '', banner: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const filteredCategories = searchQuery
        ? categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : categories;

    const categoryTree = buildTree(filteredCategories);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
            <RefreshCw className="animate-spin text-purple-500" size={32} />
            <p className="animate-pulse tracking-widest text-xs uppercase font-bold text-purple-500/50">Accessing Taxonomy Matrix...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Taxonomy Hub</h1>
                    <p className="text-slate-500 mt-1 font-medium flex items-center gap-2">
                        <Layers size={16} className="text-purple-500" />
                        Hierarchical Structure Interface
                    </p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search nodes..."
                            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={18} /> New Node
                    </button>
                </div>
            </div>

            {/* Tree Container */}
            <div className="aurora-glass-card rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-white/40 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Global Hierarchy</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Catalog Structure Matrix</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="px-3 py-1 bg-purple-500/10 text-purple-600 rounded-lg text-xs font-bold border border-purple-500/20">
                            {categories.length} Total Nodes
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-2 min-h-[400px]">
                    {categoryTree.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl">
                            <Layers size={48} className="mb-4 opacity-20" />
                            <p className="font-bold text-sm tracking-widest uppercase opacity-40">No Nodes Found</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {categoryTree.map((node) => (
                                <CategoryNode
                                    key={node.id}
                                    node={node}
                                    onEdit={openModal}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="aurora-glass-card w-full max-w-lg rounded-[2.5rem] border border-white/20 shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/10">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/20 rounded-xl text-purple-400">
                                        {editingCategory ? <Edit size={20} /> : <Plus size={20} />}
                                    </div>
                                    {editingCategory ? 'Update Node' : 'Initialize Node'}
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white outline-none focus:border-purple-500/50 transition-all font-medium"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">Parent Node</label>
                                            <select
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white outline-none focus:border-purple-500/50 transition-all font-medium appearance-none"
                                                value={formData.parentId}
                                                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                                            >
                                                <option value="" className="bg-slate-800">None (Root)</option>
                                                {categories.filter(c => c.id !== editingCategory?.id).map(c => (
                                                    <option key={c.id} value={c.id} className="bg-slate-800">{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">Icon Ref</label>
                                            <input
                                                type="text"
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white outline-none focus:border-purple-500/50 transition-all font-medium"
                                                placeholder="lucide-name"
                                                value={formData.icon}
                                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-widest pl-1">Description</label>
                                        <textarea
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white outline-none focus:border-purple-500/50 transition-all font-medium h-24 resize-none"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-6 py-4 rounded-2xl font-bold bg-white/5 text-slate-300 hover:bg-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-purple-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <Save size={18} />
                                        Commit Protocol
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

const CategoryNode = ({ node, onEdit, onDelete, level = 0 }) => {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = node.children && node.children.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`select-none ${level > 0 ? 'ml-8' : ''}`}
        >
            <div className="flex items-center group/item py-2">
                <div className="flex items-center gap-4 flex-1 aurora-glass-card border border-white/5 p-4 rounded-2xl hover:bg-white/50 transition-all group-hover/item:border-purple-500/30">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        {hasChildren ? (
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="text-slate-400 hover:text-purple-500 transition-colors p-1"
                            >
                                <motion.div animate={{ rotate: expanded ? 0 : -90 }}>
                                    <ChevronDown size={14} />
                                </motion.div>
                            </button>
                        ) : (
                            <div className="w-6" />
                        )}

                        <div className={`p-2 rounded-xl ${level === 0 ? 'bg-purple-500/10 text-purple-600' : 'bg-slate-100 text-slate-500'}`}>
                            <Folder size={16} />
                        </div>

                        <div className="truncate">
                            <span className="font-bold text-slate-700 block truncate">{node.name}</span>
                            {node.description && <span className="text-[10px] text-slate-400 font-medium truncate italic">{node.description}</span>}
                        </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-all">
                        <button
                            onClick={() => onEdit(node)}
                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => onDelete(node.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {hasChildren && expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-l-2 border-slate-100 ml-4 pl-2"
                    >
                        {node.children.map(child => (
                            <CategoryNode
                                key={child.id}
                                node={child}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                level={level + 1}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CategoryManager;
