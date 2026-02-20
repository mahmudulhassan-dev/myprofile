import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Settings, Shield, Moon, Eye } from 'lucide-react';

const SettingsTab = ({ data, refresh }) => {
    const [formData, setFormData] = useState(data || {
        is_visible: true,
        verified_badge: false,
        work_status: 'Available',
        theme_config: {}
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                toast.success('Settings updated');
                refresh();
            } else {
                toast.error('Update failed');
            }
        } catch (error) { toast.error('Network error'); }
        finally { setLoading(false); }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-700">Profile Settings & Privacy</h3>

            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                {/* Visibility */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Eye size={20} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800">Public Visibility</h4>
                            <p className="text-sm text-slate-500">Show your profile publicly to visitors.</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="is_visible" checked={formData.is_visible || false} onChange={handleChange} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                {/* Verified Badge */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800">Verified Badge</h4>
                            <p className="text-sm text-slate-500">Display a verified checkmark next to your name.</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="verified_badge" checked={formData.verified_badge || false} onChange={handleChange} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                </div>

                {/* Work Status */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <Settings size={20} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800">Work Status</h4>
                            <p className="text-sm text-slate-500">Display your current availability.</p>
                        </div>
                    </div>
                    <select
                        name="work_status"
                        value={formData.work_status || 'Available'}
                        onChange={handleChange}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="Available">Available for Work</option>
                        <option value="Busy">Busy / Occupied</option>
                        <option value="Not Taking Clients">Not Taking Clients</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end">
                <button onClick={handleSave} disabled={loading} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50">
                    {loading ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </div>
    );
};
export default SettingsTab;
