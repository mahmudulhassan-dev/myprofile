import React, { useState, useEffect } from 'react';
import { Mail, Upload, Download, Trash2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SubscriberManager = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, pending: 0, subscribed: 0, unsubscribed: 0 });

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/newsletter/subscribers', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setSubscribers(data.subscribers || []);

            // Calculate dummy stats from current page (ideally from backend)
            const stats0 = { total: data.total, pending: 0, subscribed: 0, unsubscribed: 0 };
            data.subscribers?.forEach(s => {
                if (s.status === 'Pending') stats0.pending++;
                if (s.status === 'Subscribed') stats0.subscribed++;
                if (s.status === 'Unsubscribed') stats0.unsubscribed++;
            });
            setStats(stats0);

        } catch (error) {
            toast.error('Failed to load subscribers');
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async () => {
        const emails = prompt('Paste comma separated emails:');
        if (!emails) return;

        const list = emails.split(',').map(e => e.trim()).filter(e => e);
        try {
            const res = await fetch('/api/admin/newsletter/subscribers/import', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ emails: list })
            });
            const data = await res.json();
            toast.success(data.message);
            fetchSubscribers();
        } catch (error) { toast.error('Import failed'); }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
                    <Mail className="text-blue-600" /> Subscribers
                </h3>
                <div className="flex gap-2">
                    <button onClick={handleImport} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">
                        <Upload size={16} /> Import
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-400 uppercase">Total</div>
                    <div className="text-2xl font-extrabold text-slate-800">{stats.total}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
                    <div className="text-xs font-bold text-green-600 uppercase">Verified</div>
                    <div className="text-2xl font-extrabold text-green-700">{stats.subscribed}</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 shadow-sm">
                    <div className="text-xs font-bold text-orange-600 uppercase">Pending</div>
                    <div className="text-2xl font-extrabold text-orange-700">{stats.pending}</div>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
                    <div className="text-xs font-bold text-red-600 uppercase">Unsub.</div>
                    <div className="text-2xl font-extrabold text-red-700">{stats.unsubscribed}</div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                        <tr>
                            <th className="p-4">Email</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Source</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="5" className="p-8 text-center text-slate-400">Loading...</td></tr>
                        ) : subscribers.length === 0 ? (
                            <tr><td colSpan="5" className="p-8 text-center text-slate-400">No subscribers yet.</td></tr>
                        ) : (
                            subscribers.map(sub => (
                                <tr key={sub.id} className="hover:bg-slate-50 transition">
                                    <td className="p-4 font-medium text-slate-700">{sub.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold flex items-center gap-1 w-fit ${sub.status === 'Subscribed' ? 'bg-green-100 text-green-600' :
                                                sub.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                                                    'bg-red-100 text-red-600'
                                            }`}>
                                            {sub.status === 'Subscribed' && <CheckCircle size={10} />}
                                            {sub.status === 'Pending' && <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />}
                                            {sub.status === 'Unsubscribed' && <XCircle size={10} />}
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500">{sub.source}</td>
                                    <td className="p-4 text-slate-500">{new Date(sub.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-right">
                                        <button className="text-slate-400 hover:text-red-600 transition"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubscriberManager;
