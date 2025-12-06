import React, { useState } from 'react';
import toast from 'react-hot-toast';

const BasicInfoTab = ({ data, refresh }) => {
    const [formData, setFormData] = useState(data?.profile || {});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/admin/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                toast.success('Profile updated');
                refresh();
            } else {
                toast.error('Update failed');
            }
        } catch (error) {
            toast.error('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <input name="fullName" value={formData.fullName || ''} onChange={handleChange} className="w-full p-3 border rounded-xl" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Designation / Role</label>
                    <input name="designation" value={formData.designation || ''} onChange={handleChange} className="w-full p-3 border rounded-xl" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Tagline</label>
                    <input name="title" value={formData.title || ''} onChange={handleChange} className="w-full p-3 border rounded-xl" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Short Bio</label>
                    <textarea name="shortBio" value={formData.shortBio || ''} onChange={handleChange} className="w-full p-3 border rounded-xl h-24" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">About Me (Long Bio)</label>
                    <textarea name="longBio" value={formData.longBio || ''} onChange={handleChange} className="w-full p-3 border rounded-xl h-48" />
                </div>
            </div>
            <div className="flex justify-end">
                <button disabled={loading} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50">
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
};
export default BasicInfoTab;
