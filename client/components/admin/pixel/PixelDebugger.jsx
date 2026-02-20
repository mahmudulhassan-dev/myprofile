import React, { useState, useEffect } from 'react';
import { RefreshCw, Check, X } from 'lucide-react';

const PixelDebugger = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/pixel/admin/logs', { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            setLogs(data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Real-time Event Logs</h3>
                <button onClick={fetchLogs} className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600">
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="p-3">Time</th>
                            <th className="p-3">Platform</th>
                            <th className="p-3">Event</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">URL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id} className="border-b hover:bg-slate-50">
                                <td className="p-3 text-slate-400">{new Date(log.createdAt).toLocaleTimeString()}</td>
                                <td className="p-3 font-medium">{log.platform}</td>
                                <td className="p-3">
                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs px-2">{log.event_name}</span>
                                </td>
                                <td className="p-3">
                                    {log.status === 'success' ? <Check size={16} className="text-green-500" /> : <X size={16} className="text-red-500" />}
                                </td>
                                <td className="p-3 text-xs text-slate-500 truncate max-w-[200px]">{log.url}</td>
                            </tr>
                        ))}
                        {logs.length === 0 && <tr><td colSpan="5" className="p-4 text-center text-slate-400">No logs yet</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PixelDebugger;
