
import React, { useState, useEffect } from 'react';
import { TagKey, Plus, Edit, Trash2, X, Save, Tag as TagIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const AttributeManager = () => {
    const [attributes, setAttributes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAttribute, setEditingAttribute] = useState(null);
    const [formData, setFormData] = useState({ name: '', slug: '', type: 'select', values: [] });
    const [termInput, setTermInput] = useState('');

    useEffect(() => {
        fetchAttributes();
    }, []);

    const fetchAttributes = async () => {
        try {
            const res = await fetch('/api/admin/attributes');
            const data = await res.json();
            if (res.ok) setAttributes(data);
        } catch (error) {
            toast.error('Failed to load attributes');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTerm();
        }
    };

    const addTerm = () => {
        if (!termInput.trim()) return;
        if (formData.values.find(v => v.name === termInput.trim())) {
            toast.error('Term already exists');
            return;
        }
        const newTerm = {
            name: termInput.trim(),
            slug: termInput.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
        };
        setFormData({ ...formData, values: [...formData.values, newTerm] });
        setTermInput('');
    };

    const removeTerm = (slug) => {
        setFormData({ ...formData, values: formData.values.filter(v => v.slug !== slug) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingAttribute ? `/api/admin/attributes/${editingAttribute.id}` : '/api/admin/attributes';
        const method = editingAttribute ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success(editingAttribute ? 'Attribute updated' : 'Attribute created');
                fetchAttributes();
                closeModal();
            } else {
                toast.error('Operation failed');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this attribute?')) return;
        try {
            const res = await fetch(`/api/admin/attributes/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Attribute deleted');
                fetchAttributes();
            }
        } catch (error) {
            toast.error('Delete failed');
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

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                        <TagKey size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Attribute Manager</h1>
                        <p className="text-slate-500">Define global attributes for products</p>
                    </div>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md"
                >
                    <Plus size={18} /> Add Attribute
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? <p className="text-slate-400">Loading...</p> : attributes.map(attr => (
                    <div key={attr.id} className="bg-white border boundary-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">{attr.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-semibold tracking-wider">{attr.type}</span>
                                    <span className="text-xs text-slate-400 font-mono">{attr.slug}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openModal(attr)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"><Edit size={16} /></button>
                                <button onClick={() => handleDelete(attr.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"><Trash2 size={16} /></button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                            {attr.values && attr.values.length > 0 ? attr.values.slice(0, 8).map((val, i) => (
                                <span key={i} className="text-xs border border-slate-200 bg-slate-50 text-slate-600 px-2 py-1 rounded-md">
                                    {val.name}
                                </span>
                            )) : <span className="text-xs text-slate-400 italic">No terms defined</span>}
                            {attr.values && attr.values.length > 8 && (
                                <span className="text-xs text-slate-400 px-1 py-1">+{attr.values.length - 8} more</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800">{editingAttribute ? 'Edit Attribute' : 'New Attribute'}</h2>
                            <button onClick={closeModal}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100" placeholder="e.g. Color" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 bg-white">
                                    <option value="select">Select (Dropdown)</option>
                                    <option value="color">Color</option>
                                    <option value="image">Image</option>
                                    <option value="button">Button / Label</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Terms (Values)</label>
                                <div className="border border-slate-200 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-100 transition bg-white">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {formData.values.map((val, i) => (
                                            <span key={i} className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1 rounded text-sm group">
                                                {val.name}
                                                <button type="button" onClick={() => removeTerm(val.slug)} className="text-slate-400 hover:text-red-500"><X size={12} /></button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={termInput}
                                            onChange={e => setTermInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            className="flex-1 outline-none text-sm min-w-[120px]"
                                            placeholder="Type and press Enter to add..."
                                        />
                                        <button type="button" onClick={addTerm} className="text-blue-600 font-medium text-sm px-2">Add</button>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">For "Color" type, use hex codes as names (e.g. #FF0000) or we can allow a separate field later.</p>
                            </div>

                            <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md mt-4">
                                Save Attribute
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttributeManager;
