import React, { useState, useEffect } from 'react';
import { Mail, Download, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SubscribersManager = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSubscribers = async () => {
        try {
            const res = await fetch('/api/subscribers');
            const data = await res.json();
            setSubscribers(data);
            setLoading(false);
        } catch (error) { setLoading(false); }
    };

    useEffect(() => { fetchSubscribers(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Remove subscriber?')) return;
        const updatedList = subscribers.filter(s => s.id !== id);
        await fetch('/api/subscribers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedList)
        });
        setSubscribers(updatedList);
        toast.success('Removed');
    };

    const handleExport = () => {
        const csv = 'Email,Status,Date\n' + subscribers.map(s => `${s.email},${s.status},${new Date(s.createdAt).toLocaleDateString()}`).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'subscribers.csv';
        a.click();
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold font-sans">Newsletter Subscribers</h2>
                    <p className="text-slate-500">Manage your email list.</p>
                </div>
                <button onClick={handleExport} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-bold flex items-center gap-2">
                    <Download size={18} /> Export CSV
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                        <tr>
                            <th className="p-4">Email</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {subscribers.length === 0 && !loading && <tr><td colSpan="4" className="p-10 text-center text-slate-400">No subscribers yet.</td></tr>}
                        {subscribers.map(sub => (
                            <tr key={sub.id} className="hover:bg-slate-50 transition">
                                <td className="p-4 font-bold text-slate-700">{sub.email}</td>
                                <td className="p-4">
                                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-bold uppercase">{sub.status}</span>
                                </td>
                                <td className="p-4 text-slate-500">{new Date(sub.createdAt).toLocaleDateString()}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleDelete(sub.id)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubscribersManager;
