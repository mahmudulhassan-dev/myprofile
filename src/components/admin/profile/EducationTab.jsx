import React, { useState } from 'react';
import { Plus, Trash2, Edit2, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

const EducationTab = ({ data = [], refresh }) => {
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
        setFormData({ institution: '', degree: '', field: '', start_date: '', end_date: '', grade: '' });
        setEditId(null);
        setIsEditing(true);
    };

    const handleCancel = () => { setIsEditing(false); setFormData({}); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const url = editId ? `/api/admin/profile/education/${editId}` : '/api/admin/profile/education';
        const method = editId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                toast.success('Education saved');
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
            await fetch(`/api/admin/profile/education/${id}`, { method: 'DELETE' });
            refresh();
            toast.success('Deleted');
        } catch (error) { toast.error('Error deleting'); }
    };

    return (
        <div className="space-y-6">
            {!isEditing ? (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-700">Education History</h3>
                        <button onClick={handleAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                            <Plus size={16} /> Add New
                        </button>
                    </div>

                    <div className="space-y-4">
                        {data.length === 0 ? <div className="text-slate-500 text-center py-8">No education added yet.</div> :
                            data.map((edu) => (
                                <div key={edu.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group">
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                        <button onClick={() => handleEdit(edu)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(edu.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                            <GraduationCap size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-slate-800">{edu.degree} in {edu.field}</h4>
                                            <p className="text-purple-600 font-medium">{edu.institution}</p>
                                            <p className="text-sm text-slate-500 mt-1">
                                                {edu.start_date} - {edu.end_date} • Grade: {edu.grade}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            ) : (
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-700 mb-6">{editId ? 'Edit Education' : 'Add Education'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input required placeholder="Degree (e.g. BSc)" value={formData.degree || ''} onChange={e => setFormData({ ...formData, degree: e.target.value })} className="p-3 border rounded-xl" />
                            <input required placeholder="Field of Study" value={formData.field || ''} onChange={e => setFormData({ ...formData, field: e.target.value })} className="p-3 border rounded-xl" />
                            <input required placeholder="Institution Name" value={formData.institution || ''} onChange={e => setFormData({ ...formData, institution: e.target.value })} className="p-3 border rounded-xl md:col-span-2" />
                            <input required type="date" placeholder="Start Date" value={formData.start_date || ''} onChange={e => setFormData({ ...formData, start_date: e.target.value })} className="p-3 border rounded-xl" />
                            <input required type="date" placeholder="End Date" value={formData.end_date || ''} onChange={e => setFormData({ ...formData, end_date: e.target.value })} className="p-3 border rounded-xl" />
                            <input placeholder="Grade / CGPA" value={formData.grade || ''} onChange={e => setFormData({ ...formData, grade: e.target.value })} className="p-3 border rounded-xl" />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={handleCancel} className="px-6 py-2 text-slate-600">Cancel</button>
                            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-xl">{loading ? 'Saving...' : 'Save'}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default EducationTab;
