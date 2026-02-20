import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { RefreshCw, Save, DollarSign } from 'lucide-react';

const CurrencyManager = () => {
    const [currencies, setCurrencies] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchData();
        fetchLogs();
    }, []);

    const fetchData = async () => {
        const res = await fetch('/api/currency');
        const data = await res.json();
        setCurrencies(data);
    };

    const fetchLogs = async () => {
        const res = await fetch('/api/currency/logs', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setLogs(data);
    };

    const handleUpdate = async (id, field, value) => {
        const updated = currencies.map(c => c.id === id ? { ...c, [field]: value } : c);
        setCurrencies(updated);
    };

    const saveCurrency = async (currency) => {
        try {
            await fetch(`/api/currency/${currency.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(currency)
            });
            toast.success('Saved');
        } catch (e) {
            toast.error('Failed');
        }
    };

    const forceFetch = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/currency/fetch', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Rates Updated');
                fetchData();
                fetchLogs();
            } else {
                toast.error('Update Failed');
            }
        } catch (e) {
            toast.error('Error');
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Currency Settings</h1>
                    <p className="text-slate-500">Manage exchange rates and auto-updates.</p>
                </div>
                <button
                    onClick={forceFetch}
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    {loading ? 'Fetching...' : 'Fetch Live Rates'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Currencies */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="font-bold mb-4 flex items-center gap-2"><DollarSign size={20} /> Active Currencies</h2>
                    <div className="space-y-4">
                        {currencies.map(c => (
                            <div key={c.id} className="p-4 border border-slate-100 rounded-lg bg-slate-50">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-lg">{c.code}</span>
                                        <span className="text-slate-500 text-sm">({c.name})</span>
                                        {c.is_primary && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">Primary</span>}
                                    </div>
                                    <span className="text-2xl font-mono">{c.symbol}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Exchange Rate (1 USD = )</label>
                                        <input
                                            type="number"
                                            value={c.exchange_rate}
                                            onChange={(e) => handleUpdate(c.id, 'exchange_rate', parseFloat(e.target.value))}
                                            disabled={c.is_primary || c.auto_update}
                                            className="w-full mt-1 p-2 border rounded bg-white"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={c.auto_update}
                                                onChange={(e) => handleUpdate(c.id, 'auto_update', e.target.checked)}
                                                disabled={c.is_primary}
                                                className="w-4 h-4 rounded text-blue-600"
                                            />
                                            Auto Update
                                        </label>
                                    </div>
                                </div>

                                {!c.is_primary && (
                                    <button
                                        onClick={() => saveCurrency(c)}
                                        className="mt-3 w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2 rounded text-sm hover:bg-slate-800"
                                    >
                                        <Save size={14} /> Save Changes
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Logs */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <h2 className="font-bold mb-4">Update Logs</h2>
                    <div className="overflow-y-auto max-h-[400px]">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 sticky top-0">
                                <tr>
                                    <th className="p-2">Time</th>
                                    <th className="p-2">Source</th>
                                    <th className="p-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map(log => (
                                    <tr key={log.id} className="border-b">
                                        <td className="p-2 text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                                        <td className="p-2">{log.source}</td>
                                        <td className="p-2">
                                            <span className={`px-2 py-1 rounded text-xs ${log.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrencyManager;
