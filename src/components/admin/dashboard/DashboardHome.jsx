import React, { useEffect, useState } from 'react';
import {
    ShoppingBag, Users, FileText, Briefcase, Mail, Activity,
    DollarSign, Server, Clock, Plus, Zap
} from 'lucide-react';
import StatCard from './StatCard';
import FinancialChart from './FinancialChart';
import PerformanceWidget from './PerformanceWidget';
import ActivityFeed from './ActivityFeed';
import { Link } from 'react-scroll'; // Or router link

const DashboardHome = ({ onNavigate }) => {
    const [stats, setStats] = useState(null);
    const [financials, setFinancials] = useState(null);
    const [system, setSystem] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [resStats, resFin, resSys, resLogs] = await Promise.all([
                fetch('/api/admin/dashboard/overview').then(r => r.json()),
                fetch('/api/admin/dashboard/financials').then(r => r.json()),
                fetch('/api/admin/dashboard/system').then(r => r.json()),
                fetch('/api/admin/dashboard/activity').then(r => r.json())
            ]);

            setStats(resStats);
            setFinancials(resFin);
            setSystem(resSys);
            setLogs(resLogs);
        } catch (error) {
            console.error("Dashboard Load Error", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Live update every 30s
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="text-white p-10">Loading Dashboard...</div>;

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-slate-400 text-sm">Welcome back, Admin</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchData} className="p-2 bg-slate-800 rounded hover:bg-slate-700 text-white border border-slate-700">
                        <Activity size={18} />
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                        <Plus size={18} /> Add New
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Products" count={stats?.products || 0} icon={ShoppingBag} color="text-blue-500" trend="up" trendValue={12} />
                <StatCard title="Total Users" count={stats?.users || 0} icon={Users} color="text-purple-500" />
                <StatCard title="Blog Posts" count={stats?.posts || 0} icon={FileText} color="text-pink-500" />
                <StatCard title="Total Revenue" count={`$${financials?.totalRevenue || 0}`} icon={DollarSign} color="text-green-500" trend="up" trendValue={8} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Charts Area (2/3) */}
                <div className="lg:col-span-2 space-y-6">
                    <FinancialChart data={financials?.chartData} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StatCard title="Pending Orders" count={0} icon={ShoppingBag} color="text-orange-500" />
                        <StatCard title="New Messages" count={stats?.contacts || 0} icon={Mail} color="text-yellow-500" />
                    </div>
                </div>

                {/* Sidebar Area (1/3) */}
                <div className="space-y-6">
                    <PerformanceWidget stats={system} />
                    <ActivityFeed logs={logs || []} />
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
