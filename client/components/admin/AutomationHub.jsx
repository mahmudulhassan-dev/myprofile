import React, { useState, useEffect } from 'react';
import { Zap, Plus, Trash2, Play, CheckCircle, AlertCircle, ToggleLeft, ToggleRight, Loader2, Link2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AutomationHub = () => {
    const [workflows, setWorkflows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newWorkflow, setNewWorkflow] = useState({
        name: '',
        trigger_event: 'new_booking',
        webhook_url: '',
        is_active: true
    });

    const triggerEvents = [
        { key: 'new_booking', label: 'New Service Booking' },
        { key: 'new_contact', label: 'New Contact Inquiry' },
        { key: 'new_user', label: 'New User Registration' },
        { key: 'new_order', label: 'New Product Order' }
    ];

    const fetchWorkflows = async () => {
        try {
            const res = await axios.get('/api/admin/automation');
            setWorkflows(res.data);
            setLoading(false);
        } catch {
            toast.error('Failed to load workflows');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkflows();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/admin/automation', newWorkflow);
            toast.success('Workflow created');
            setShowAddModal(false);
            setNewWorkflow({ name: '', trigger_event: 'new_booking', webhook_url: '', is_active: true });
            fetchWorkflows();
        } catch {
            toast.error('Failed to create workflow');
        }
    };

    const handleToggle = async (workflow) => {
        try {
            await axios.put(`/api/admin/automation/${workflow.id}`, { is_active: !workflow.is_active });
            fetchWorkflows();
        } catch {
            toast.error('Update failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axios.delete(`/api/admin/automation/${id}`);
            toast.success('Deleted');
            fetchWorkflows();
        } catch {
            toast.error('Delete failed');
        }
    };

    const handleTest = async (id) => {
        toast.promise(
            axios.post(`/api/admin/automation/${id}/test`),
            {
                loading: 'Sending test trigger...',
                success: 'Test signal received by n8n!',
                error: 'Test failed. Check webhook URL.'
            }
        ).then(() => fetchWorkflows()).catch(() => { });
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Zap className="text-amber-500" fill="currentColor" /> Automation Hub
                    </h2>
                    <p className="text-slate-500 mt-1">Connect your portfolio events to n8n webhooks</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition shadow-lg shadow-blue-200"
                >
                    <Plus size={20} /> Create Workflow
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workflows.map((workflow) => (
                    <div key={workflow.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition group overflow-hidden relative">
                        <div className={`absolute top-0 right-0 w-2 h-full ${workflow.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>

                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition">
                                <Link2 className="text-slate-400 group-hover:text-blue-500" size={24} />
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleTest(workflow.id)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition" title="Test Connection">
                                    <Play size={18} />
                                </button>
                                <button onClick={() => handleDelete(workflow.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-slate-800 truncate" title={workflow.name}>{workflow.name}</h3>
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                            {workflow.trigger_event.replace('_', ' ')}
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="text-xs text-slate-400 font-medium">
                                WEBHOOK ENDPOINT
                                <div className="mt-1 bg-slate-50 p-2 rounded-lg truncate text-slate-600 border border-slate-100 font-mono">
                                    {workflow.webhook_url}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <div className="text-xs text-slate-400">
                                    Last triggered: {workflow.last_triggered ? new Date(workflow.last_triggered).toLocaleString() : 'Never'}
                                </div>
                                <button onClick={() => handleToggle(workflow)}>
                                    {workflow.is_active ?
                                        <ToggleRight size={32} className="text-emerald-500" /> :
                                        <ToggleLeft size={32} className="text-slate-300" />
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {workflows.length === 0 && (
                    <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                        <Zap size={48} className="mb-4 opacity-20" />
                        <p className="text-lg font-medium">No workflows found</p>
                        <p className="text-sm">Create your first n8n automation to begin</p>
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                            <h2 className="text-2xl font-bold">New Automation Workflow</h2>
                            <p className="opacity-80">Bridge portfolio events to external apps</p>
                        </div>
                        <form onSubmit={handleCreate} className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Workflow Name</label>
                                <input
                                    required
                                    type="text"
                                    value={newWorkflow.name}
                                    onChange={e => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                                    placeholder="e.g., Sync Contacts to Slack"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Trigger Event</label>
                                    <select
                                        value={newWorkflow.trigger_event}
                                        onChange={e => setNewWorkflow({ ...newWorkflow, trigger_event: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                                    >
                                        {triggerEvents.map(ev => <option key={ev.key} value={ev.key}>{ev.label}</option>)}
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-3 text-blue-700 w-full border border-blue-100">
                                        <AlertCircle size={20} />
                                        <span className="text-xs font-semibold">Fire on every event</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Webhook URL (n8n)</label>
                                <input
                                    required
                                    type="url"
                                    value={newWorkflow.webhook_url}
                                    onChange={e => setNewWorkflow({ ...newWorkflow, webhook_url: e.target.value })}
                                    placeholder="https://your-n8n-instance.com/webhook/..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold transition shadow-lg shadow-blue-200"
                                >
                                    Activate Workflow
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AutomationHub;
