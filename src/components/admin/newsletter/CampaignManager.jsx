import React, { useState, useEffect } from 'react';
import { Send, Edit2, Play, CheckCircle, AlertTriangle, FileText, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import RichTextEditor from '../../common/RichTextEditor';

const CampaignManager = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);

    const [formData, setFormData] = useState({
        subject: '',
        preheader: '',
        content: '',
        status: 'Draft'
    });

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/newsletter/campaigns', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setCampaigns(data || []);
        } catch (error) { toast.error('Failed to load campaigns'); }
        finally { setLoading(false); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const url = editingCampaign ? `/api/admin/newsletter/campaigns/${editingCampaign.id}` : '/api/admin/newsletter/campaigns';
        const method = editingCampaign ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error('Failed to save');

            toast.success('Campaign saved');
            setIsEditorOpen(false);
            fetchCampaigns();
        } catch (error) { toast.error(error.message); }
    };

    const handleSend = async (id) => {
        if (!window.confirm('Are you sure you want to SEND this campaign to ALL subscribers? This cannot be undone.')) return;

        try {
            const res = await fetch(`/api/admin/newsletter/campaigns/${id}/send`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                fetchCampaigns();
            } else {
                toast.error(data.error);
            }
        } catch (error) { toast.error('Send failed'); }
    };

    const openEditor = (campaign = null) => {
        if (campaign) {
            setEditingCampaign(campaign);
            setFormData({
                subject: campaign.subject,
                preheader: campaign.preheader || '',
                content: campaign.content || '',
                status: campaign.status
            });
        } else {
            setEditingCampaign(null);
            setFormData({ subject: '', preheader: '', content: '', status: 'Draft' });
        }
        setIsEditorOpen(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {!isEditorOpen ? (
                <>
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
                            <Send className="text-blue-600" /> Campaigns
                        </h3>
                        <button onClick={() => openEditor()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow hover:bg-blue-700 transition">
                            <Plus size={16} /> New Campaign
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campaigns.map(c => (
                            <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${c.status === 'Sent' ? 'bg-green-100 text-green-600' :
                                            c.status === 'Draft' ? 'bg-slate-100 text-slate-500' :
                                                'bg-blue-100 text-blue-600'
                                        }`}>
                                        {c.status}
                                    </span>
                                    <span className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h4 className="font-bold text-slate-800 text-lg mb-1 truncate">{c.subject}</h4>
                                <p className="text-xs text-slate-500 mb-4 h-10 line-clamp-2">{c.preheader || 'No preview text'}</p>

                                {c.status === 'Sent' ? (
                                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg text-center mb-4">
                                        <div>
                                            <div className="text-[10px] uppercase font-bold text-slate-400">Sent</div>
                                            <div className="font-bold text-slate-700">{c.stats?.sent || 0}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase font-bold text-slate-400">Opens</div>
                                            <div className="font-bold text-blue-600">{c.stats?.opened || 0}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase font-bold text-slate-400">Clicks</div>
                                            <div className="font-bold text-green-600">{c.stats?.clicked || 0}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-2 mb-4">
                                        <button onClick={() => handleSend(c.id)} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 flex items-center justify-center gap-2">
                                            <Play size={14} /> Send Now
                                        </button>
                                        <button onClick={() => openEditor(c)} className="w-10 bg-slate-50 text-slate-500 py-2 rounded-lg flex items-center justify-center hover:bg-slate-100">
                                            <Edit2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-slide-up">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl">{editingCampaign ? 'Edit Campaign' : 'New Campaign'}</h3>
                        <button onClick={() => setIsEditorOpen(false)} className="text-sm font-bold text-slate-500 hover:text-slate-800">Cancel</button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold mb-1">Subject Line</label>
                                <input
                                    className="w-full border p-2 rounded-lg"
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                    placeholder="e.g. Weekly Roundup: 5 Tips for..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Preheader Text</label>
                                <input
                                    className="w-full border p-2 rounded-lg"
                                    value={formData.preheader}
                                    onChange={e => setFormData({ ...formData, preheader: e.target.value })}
                                    placeholder="Brief summary displayed in inbox..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">Email Content</label>
                            <RichTextEditor
                                value={formData.content}
                                onChange={(val) => setFormData({ ...formData, content: val })}
                                placeholder="Design your email here..."
                                height="400px"
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                                Save Draft
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CampaignManager;
