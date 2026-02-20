import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const ExperienceTab = ({ data = [], refresh }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    const handleEdit = (item) => {
        setFormData(item);
        setEditId(item.id);
        setIsEditing(true);
    };

    const handleAdd = () => {
        setFormData({
            company: '', designation: '', start_date: '', end_date: '',
            is_current: false, description: '', location: ''
        });
        setEditId(null);
        setIsEditing(true);
    };

    const handleCancel = () => { setIsEditing(false); setFormData({}); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const url = editId ? `/api/admin/profile/experience/${editId}` : '/api/admin/profile/experience';
        const method = editId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                toast.success('Experience saved');
                refresh();
                handleCancel();
            } else {
                toast.error('Operation failed');
            }
        } catch (error) { toast.error('Network error'); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this record?')) return;
        try {
            await fetch(`/api/admin/profile/experience/${id}`, { method: 'DELETE' });
            refresh();
            toast.success('Deleted');
        } catch (error) { toast.error('Error deleting'); }
    };

    return (
        <div className="space-y-6">
            {!isEditing ? (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-700">Professional Experience</h3>
                        <button onClick={handleAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                            <Plus size={16} /> Add New
                        </button>
                    </div>

                    <div className="space-y-4">
                        {data.length === 0 ? <div className="text-slate-500 text-center py-8">No experience added yet.</div> :
                            data.map((exp) => (
                                <div key={exp.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group">
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                        <button onClick={() => handleEdit(exp)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(exp.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                            <Briefcase size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-slate-800">{exp.designation}</h4>
                                            <p className="text-blue-600 font-medium">{exp.company}</p>
                                            <p className="text-sm text-slate-500 mt-1">
                                                {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date} • {exp.location}
                                            </p>
                                            <p className="text-slate-600 mt-3 text-sm leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            ) : (
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-700 mb-6">{editId ? 'Edit Experience' : 'Add Experience'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input required placeholder="Designation" value={formData.designation || ''} onChange={e => setFormData({ ...formData, designation: e.target.value })} className="p-3 border rounded-xl" />
                            <input required placeholder="Company Name" value={formData.company || ''} onChange={e => setFormData({ ...formData, company: e.target.value })} className="p-3 border rounded-xl" />
                            <input required type="date" placeholder="Start Date" value={formData.start_date || ''} onChange={e => setFormData({ ...formData, start_date: e.target.value })} className="p-3 border rounded-xl" />
                            <input type="date" disabled={formData.is_current} placeholder="End Date" value={formData.end_date || ''} onChange={e => setFormData({ ...formData, end_date: e.target.value })} className="p-3 border rounded-xl disabled:bg-slate-200" />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="curr" checked={formData.is_current || false} onChange={e => setFormData({ ...formData, is_current: e.target.checked })} />
                            <label htmlFor="curr" className="text-sm text-slate-700 font-medium">I currently work here</label>
                        </div>
                        <textarea placeholder="Job Description..." value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-3 border rounded-xl h-32" />

                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={handleCancel} className="px-6 py-2 text-slate-600">Cancel</button>
                            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-xl">{loading ? 'Saving...' : 'Save'}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ExperienceTab;
