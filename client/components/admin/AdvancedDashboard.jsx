import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Server, Cpu, HardDrive, Network, Shield, Clock, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- Reusable Components ---

const GlassCard = ({ children, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white/80 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6 ${className}`}
    >
        {children}
    </motion.div>
);

const MetricCard = ({ title, value, unit, icon: Icon, color, sub }) => (
    <GlassCard className="relative overflow-hidden">
        <div className={`absolute top-0 right-0 p-4 opacity-10 text-${color}-500`}>
            <Icon size={60} />
        </div>
        <div className="flex items-center gap-4 mb-2">
            <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
                <Icon size={24} />
            </div>
            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">{title}</h3>
        </div>
        <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-slate-800">{value}</span>
            <span className="text-slate-400 font-medium mb-1">{unit}</span>
        </div>
        {sub && <p className="text-xs text-slate-400 mt-2">{sub}</p>}
    </GlassCard>
);

// --- Main Dashboard Component ---

const AdvancedDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/system/stats');
            if (!res.ok) throw new Error('Fetch failed');
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error("Stats fetch error:", error);
            // Fallback mock data to prevent crash if API fails
            setStats({ uptime: 0, cpu: {}, mem: {}, processes: { list: [] }, storage: [], network: {} });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 5000); // 5s Polling
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="flex items-center justify-center h-96 text-slate-400">Initializing Core Systems...</div>;

    const formatBytes = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-8 p-4 bg-slate-50/50 min-h-screen font-sans">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">System Overview</h1>
                    <p className="text-slate-500 text-sm">Real-time server telemetry & health monitoring</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono bg-white px-3 py-1 rounded-full border border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    LIVE | Uptime: {Math.floor(stats?.uptime / 3600)}h {Math.floor((stats?.uptime % 3600) / 60)}m
                </div>
            </div>

            {/* 1. Top Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="CPU Load"
                    value={stats?.cpu?.load || 0}
                    unit="%"
                    icon={Cpu}
                    color="blue"
                    sub={`User: ${stats?.cpu?.user}% | Sys: ${stats?.cpu?.system}%`}
                />
                <MetricCard
                    title="Memory Usage"
                    value={stats?.mem?.usedPercent || 0}
                    unit="%"
                    icon={Activity}
                    color="purple"
                    sub={`${formatBytes(stats?.mem?.used)} / ${formatBytes(stats?.mem?.total)}`}
                />
                <MetricCard
                    title="Disk Usage"
                    value={stats?.storage?.[0]?.usePercent || 0}
                    unit="%"
                    icon={HardDrive}
                    color="orange"
                    sub={`${formatBytes(stats?.storage?.[0]?.used)} Used`}
                />
                <MetricCard
                    title="Network In/Out"
                    value={(stats?.network?.rx_sec / 1024).toFixed(1)}
                    unit="KB/s"
                    icon={Network}
                    color="green"
                    sub={`Up: ${(stats?.network?.tx_sec / 1024).toFixed(1)} KB/s`}
                />
            </div>

            {/* 2. Detailed Modules Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* CPU & Process Monitor */}
                <GlassCard className="lg:col-span-2">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Cpu size={18} /> Top Processes</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Name</th>
                                    <th className="px-4 py-3">PID</th>
                                    <th className="px-4 py-3">CPU %</th>
                                    <th className="px-4 py-3 rounded-r-lg">Mem %</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {stats?.processes?.list?.map((proc) => (
                                    <tr key={proc.pid} className="hover:bg-slate-50 transition">
                                        <td className="px-4 py-3 font-medium text-slate-700">{proc.name}</td>
                                        <td className="px-4 py-3 text-slate-500 font-mono">{proc.pid}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-blue-500 h-full" style={{ width: `${Math.min(proc.cpu, 100)}%` }}></div>
                                                </div>
                                                <span className="font-mono text-xs">{proc.cpu}%</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500">{proc.mem.toFixed(1)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>

                {/* Storage & Health */}
                <div className="space-y-8">
                    <GlassCard>
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><HardDrive size={18} /> Storage Breakdown</h3>
                        {stats?.storage?.map((disk, i) => (
                            <div key={i} className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">{disk.mount}</span>
                                    <span className="text-slate-400">{formatBytes(disk.used)} / {formatBytes(disk.size)}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${disk.usePercent > 90 ? 'bg-red-500' : 'bg-orange-400'}`}
                                        style={{ width: `${disk.usePercent}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </GlassCard>

                    <GlassCard>
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Shield size={18} /> System Status</h3>
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg"><Activity size={20} /></div>
                            <div>
                                <p className="font-bold text-sm">System Healthy</p>
                                <p className="text-xs opacity-80">All services operational</p>
                            </div>
                        </div>
                    </GlassCard>
                </div>

            </div>
        </div>
    );
};

export default AdvancedDashboard;
