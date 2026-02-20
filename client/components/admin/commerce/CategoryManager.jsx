
import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit, Trash2, ChevronRight, ChevronDown, Folder, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '', parentId: '', description: '', icon: '', banner: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            if (res.ok) setCategories(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

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
        const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories';
        const method = editingCategory ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    parentId: formData.parentId ? parseInt(formData.parentId) : null
                })
            });

            if (res.ok) {
                toast.success(editingCategory ? 'Category updated' : 'Category created');
                fetchCategories();
                closeModal();
            } else {
                const err = await res.json();
                toast.error(err.error || 'Operation failed');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this category? Sub-categories will be moved to parent.')) return;
        try {
            const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Category deleted');
                fetchCategories();
            }
        } catch (error) {
            toast.error('Delete failed');
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

    const categoryTree = buildTree(categories);

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 rounded-xl shadow-sm border border-purple-200/50">
                        <Layers size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Category Manager</h1>
                        <p className="text-slate-500">Organize your product catalog</p>
                    </div>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md shadow-blue-600/20 font-medium"
                >
                    <Plus size={18} /> Add Category
                </button>
            </div>

            <div className="bg-white border boundary-slate-200 rounded-xl shadow-sm flex flex-col min-h-[500px]">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                    <h3 className="font-semibold text-slate-700">Category Hierarchy</h3>
                </div>
                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-10 text-slate-400">Loading hierarchy...</div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                            No categories found. Start by adding one.
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {categoryTree.map(node => (
                                <CategoryNode
                                    key={node.id}
                                    node={node}
                                    onEdit={openModal}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl transform transition-all">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingCategory ? 'Edit Category' : 'New Category'}
                            </h2>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none transition"
                                    placeholder="e.g. Electronics"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Parent Category</label>
                                <select
                                    value={formData.parentId}
                                    onChange={e => setFormData({ ...formData, parentId: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none bg-white transition"
                                >
                                    <option value="">None (Top Level)</option>
                                    {categories
                                        .filter(c => c.id !== editingCategory?.id) // Prevent self-parent
                                        .map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none transition h-24 resize-none"
                                    placeholder="Category description..."
                                ></textarea>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md shadow-blue-500/20 transition font-medium flex items-center gap-2"
                                >
                                    <Save size={18} /> Save Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const CategoryNode = ({ node, onEdit, onDelete, level = 0 }) => {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="select-none">
            <div
                className={`flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition group ${level > 0 ? 'ml-6 border-l-2 border-l-slate-200' : ''}`}
            >
                <div className="flex items-center gap-3">
                    {hasChildren ? (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="text-slate-400 hover:text-slate-600 transition"
                        >
                            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                    ) : (
                        <div className="w-4" />
                    )}

                    <div className={`p-1.5 rounded-lg ${level === 0 ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                        <Folder size={16} />
                    </div>

                    <div>
                        <span className="font-medium text-slate-700">{node.name}</span>
                        {node.count > 0 && <span className="ml-2 text-xs text-slate-400">({node.count})</span>}
                    </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
                    <button
                        onClick={() => onEdit(node)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                        title="Edit"
                    >
                        <Edit size={14} />
                    </button>
                    <button
                        onClick={() => onDelete(node.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                        title="Delete"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {hasChildren && expanded && (
                <div className="border-l border-slate-100 ml-4 pl-2 mt-1 space-y-1">
                    {node.children.map(child => (
                        <CategoryNode
                            key={child.id}
                            node={child}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryManager;
