import React, { useState } from 'react';
import { Plus, Trash2, Edit2, ExternalLink, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';

const SocialsTab = ({ data = [], refresh }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ platform: '', url: '', icon: '' });
    const [loading, setLoading] = useState(false);

    const handleEdit = (social) => {
        setFormData(social);
        setEditId(social.id);
        setIsEditing(true);
    };

    const handleAdd = () => {
        setFormData({ platform: '', url: '', icon: '' });
        setEditId(null);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({ platform: '', url: '', icon: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const url = editId ? `/api/admin/profile/socials/${editId}` : '/api/admin/profile/socials';
        const method = editId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                toast.success(editId ? 'Social link updated' : 'Social link added');
                refresh();
                handleCancel();
            } else {
                toast.error('Operation failed');
            }
        } catch (error) {
            toast.error('Network error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this link?')) return;
        try {
            await fetch(`/api/admin/profile/socials/${id}`, { method: 'DELETE' });
            toast.success('Deleted');
            refresh();
        } catch (error) {
            toast.error('Error deleting');
        }
    };

    return (
        <div className="space-y-6">
            {!isEditing ? (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-700">Social Connections</h3>
                        <button onClick={handleAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                            <Plus size={16} /> Add New
                        </button>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        {data.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">No social links added yet.</div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {data.map((social) => (
                                    <div key={social.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                                <ExternalLink size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-800">{social.platform}</h4>
                                                <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">{social.url}</a>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                                            <button onClick={() => handleEdit(social)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(social.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-700 mb-6">{editId ? 'Edit Link' : 'Add New Link'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Platform Name</label>
                                <input
                                    required
                                    value={formData.platform}
                                    onChange={e => setFormData({ ...formData, platform: e.target.value })}
                                    placeholder="e.g. LinkedIn"
                                    className="w-full p-3 border rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Icon Class (optional)</label>
                                <input
                                    value={formData.icon}
                                    onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                    placeholder="fa-brands fa-linkedin"
                                    className="w-full p-3 border rounded-xl"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Profile URL</label>
                                <input
                                    required
                                    type="url"
                                    value={formData.url}
                                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full p-3 border rounded-xl"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={handleCancel} className="px-6 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
                                {loading ? 'Saving...' : 'Save Link'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default SocialsTab;
