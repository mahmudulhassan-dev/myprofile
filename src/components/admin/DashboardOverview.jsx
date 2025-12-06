import React, { useState, useEffect } from 'react';
// import { 
//    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
//    AreaChart, Area, PieChart, Pie, Cell 
// } from 'recharts';
import {
    Users, ShoppingBag, Eye, Server, Activity, ArrowUp, ArrowDown,
    FileText, Image, DollarSign, Clock, Shield, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

// --- Components ---

const StatCard = ({ title, value, sub, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
                <Icon size={24} />
            </div>
        </div>
        {sub && (
            <div className="flex items-center gap-2">
                <span className={`flex items-center text-xs font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                    {sub}
                </span>
                <span className="text-slate-400 text-xs">vs last period</span>
            </div>
        )}
    </div>
);

const DashboardOverview = () => {
    const [overview, setOverview] = useState(null);
    const [metrics, setMetrics] = useState([]);
    const [health, setHealth] = useState(null);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [resOverview, resMetrics, resHealth, resActivity] = await Promise.all([
                fetch('/api/admin/dashboard/overview'),
                fetch('/api/admin/dashboard/metrics?days=7'),
                fetch('/api/admin/dashboard/system-health'),
                fetch('/api/admin/dashboard/recent-activity?limit=5')
            ]);

            setOverview(await resOverview.json());
            setMetrics(await resMetrics.json());
            setHealth(await resHealth.json());
            setActivity(await resActivity.json());
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
            // toast.error('Error loading dashboard data');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000); // Live update
        return () => clearInterval(interval);
    }, []);

    const handleQuickAction = async (action) => {
        try {
            const res = await fetch('/api/admin/dashboard/actions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, confirm: true })
            });
            const data = await res.json();
            if (res.ok) toast.success(data.message);
            else toast.error(data.error);
            fetchData(); // Refresh logs
        } catch (e) { toast.error('Action failed'); }
    };

    if (loading && !overview) return <div className="p-10 text-center text-slate-400">Loading Dashboard...</div>;

    return (
        <div className="space-y-6 animate-fade-in p-2">
            {/* 1.1 Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Projects" value={overview?.projects || 0} sub="Active" icon={Image} color="blue" trend="up" />
                <StatCard title="Total Services" value={overview?.services || 0} sub="Offerings" icon={ShoppingBag} color="green" trend="up" />
                <StatCard title="Total Products" value={overview?.products || 0} sub="Inventory" icon={DollarSign} color="purple" trend="up" />
                <StatCard title="Storage Used" value={`${((overview?.storageBytes || 0) / 1024 / 1024).toFixed(1)} MB`} sub={`${overview?.files || 0} Files`} icon={Server} color="indigo" trend="up" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1.3 Performance Graph Placeholders */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 text-lg">Traffic Analytics (7 Days)</h3>
                        <button onClick={fetchData} className="p-2 hover:bg-slate-100 rounded-full"><RefreshCw size={14} /></button>
                    </div>
                    <div className="h-72 w-full flex items-center justify-center bg-slate-50 text-slate-400">
                        {/* Chart temporarily disabled for debugging */}
                        Chart Loading...
                    </div>
                </div>

                {/* 1.10 System Health Monitor */}
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <h3 className="font-bold flex items-center gap-2 mb-4"><Activity size={18} className="text-green-400" /> System Health</h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-slate-400">CPU Load</span>
                                    <span className={`font-mono ${health?.cpu_pct > 80 ? 'text-red-400' : 'text-green-400'}`}>{health?.cpu_pct}%</span>
                                </div>
                                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${health?.cpu_pct}%` }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-slate-400">Memory</span>
                                    <span className="text-yellow-400 font-mono">{health?.mem_pct}%</span>
                                </div>
                                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-yellow-500 h-full transition-all duration-500" style={{ width: `${health?.mem_pct}%` }}></div>
                                </div>
                            </div>

                            <div className="flex justify-between pt-2 border-t border-slate-700">
                                <span className="text-slate-400">DB Status</span>
                                <span className={`font-bold ${health?.db_status === 'ok' ? 'text-green-400' : 'text-red-500'}`}>
                                    {health?.db_status?.toUpperCase()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Uptime</span>
                                <span className="text-white font-mono">{Math.floor((health?.uptime || 0) / 3600)}h {Math.floor(((health?.uptime || 0) % 3600) / 60)}m</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => handleQuickAction('clear_cache')} className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition text-left">
                                🗑️ Clear System Cache
                            </button>
                            <button onClick={() => handleQuickAction('toggle_maintenance')} className="w-full py-2 px-4 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium transition text-left">
                                ⚠️ Toggle Maintenance Mode
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 1.8 Recent Activity */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock size={16} /> Recent Audit Logs</h3>
                <div className="space-y-0 divide-y divide-slate-100">
                    {activity.length === 0 ? <p className="text-slate-400 text-sm py-2">No recent activity.</p> : activity.map((log, i) => (
                        <div key={i} className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs">
                                    {log.actor_name?.[0] || 'S'}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{log.action || 'Action'} <span className="text-slate-400 font-normal">on {log.object_type}</span></p>
                                    <p className="text-xs text-slate-400">{new Date(log.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">{log.ip_address}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
