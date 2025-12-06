import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Folder, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        color: '#3b82f6',
        icon: '',
        image: '',
        seo_title: '',
        seo_desc: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/blog/categories');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingCategory ? `/api/admin/blog/categories/${editingCategory.id}` : '/api/admin/blog/categories';
        const method = editingCategory ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error('Failed to save');

            toast.success('Category saved');
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            await fetch(`/api/admin/blog/categories/${id}`, { method: 'DELETE' });
            toast.success('Category deleted');
            fetchCategories();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug || '',
                description: category.description || '',
                color: category.color || '#3b82f6',
                icon: category.icon || '',
                image: category.image || '',
                seo_title: category.seo_title || '',
                seo_desc: category.seo_desc || ''
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '', slug: '', description: '', color: '#3b82f6',
                icon: '', image: '', seo_title: '', seo_desc: ''
            });
        }
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-700">Categories</h3>
                <button
                    onClick={() => openModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                    <Plus size={16} /> Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(category => (
                    <div key={category.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: category.color }}>
                                {category.name.charAt(0)}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                <button onClick={() => openModal(category)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(category.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <h4 className="font-bold text-slate-800 text-lg mb-1">{category.name}</h4>
                        <p className="text-xs text-slate-400 font-mono mb-3">/blog/category/{category.slug}</p>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">{category.description || 'No description'}</p>

                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-2 rounded-lg inline-flex">
                            <Folder size={14} /> {category.BlogPosts?.length || 0} Posts
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="font-bold text-xl">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Name</label>
                                    <input
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full border p-2 rounded-lg"
                                        placeholder="Tech, Lifestyle..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Color</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={formData.color}
                                            onChange={e => setFormData({ ...formData, color: e.target.value })}
                                            className="h-10 w-20 rounded cursor-pointer"
                                        />
                                        <input
                                            value={formData.color}
                                            onChange={e => setFormData({ ...formData, color: e.target.value })}
                                            className="flex-1 border p-2 rounded-lg uppercase"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full border p-2 rounded-lg h-20 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Slug (Optional)</label>
                                    <input
                                        value={formData.slug}
                                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full border p-2 rounded-lg font-mono text-sm"
                                        placeholder="auto-generated"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Cover Image URL</label>
                                    <input
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full border p-2 rounded-lg text-sm"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-sm text-slate-500 uppercase mb-3 flex items-center gap-2">
                                    <ImageIcon size={14} /> SEO Metadata
                                </h4>
                                <div className="space-y-3">
                                    <input
                                        value={formData.seo_title}
                                        onChange={e => setFormData({ ...formData, seo_title: e.target.value })}
                                        className="w-full border p-2 rounded-lg text-sm"
                                        placeholder="SEO Title (Leave empty to use Name)"
                                    />
                                    <textarea
                                        value={formData.seo_desc}
                                        onChange={e => setFormData({ ...formData, seo_desc: e.target.value })}
                                        className="w-full border p-2 rounded-lg text-sm h-16 resize-none"
                                        placeholder="SEO Description"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20">
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

export default CategoryManager;
