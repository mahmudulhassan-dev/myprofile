import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Cpu, HardDrive, Network,
    Terminal, ShieldCheck, RefreshCw, ChevronRight,
    Zap, Database, BarChart3, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';

// --- Sub-Components ---

const MetricCard = ({ title, value, unit, icon: Icon, color, chartData }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="aurora-glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/5"
    >
        <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-125 duration-500">
            <Icon size={80} color={color} />
        </div>

        <div className="flex flex-col h-full justify-between relative z-10">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <Icon size={20} color={color} />
                </div>
                <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">{title}</span>
            </div>

            <div>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white tracking-tight">{value}</span>
                    <span className="text-lg font-medium text-slate-500">{unit}</span>
                </div>
            </div>

            <div className="h-16 w-full mt-6 opacity-30 group-hover:opacity-60 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id={`gradient-${title.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            fillOpacity={1}
                            fill={`url(#gradient-${title.replace(/\s+/g, '-')})`}
                            strokeWidth={2}
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    </motion.div>
);

const ProcessList = ({ processes }) => (
    <div className="aurora-glass-card rounded-3xl p-6 h-full border border-white/5">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <Terminal className="text-indigo-400" size={24} />
                <h3 className="text-xl font-bold text-white">Top Processes</h3>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-white/5 py-1 px-3 rounded-full border border-white/10 uppercase">Live</span>
        </div>

        <div className="space-y-4">
            {processes.map((proc, i) => (
                <motion.div
                    key={`${proc.pid}-${i}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-mono text-indigo-300 border border-white/5">
                            {proc.pid}
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-white truncate max-w-[150px]">{proc.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono uppercase">System Process</div>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="text-right">
                            <div className="text-xs font-bold text-white">{proc.cpu}%</div>
                            <div className="text-[9px] text-slate-600 uppercase font-bold tracking-tighter">CPU</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold text-white">{proc.mem}%</div>
                            <div className="text-[9px] text-slate-600 uppercase font-bold tracking-tighter">RAM</div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>

        <button className="w-full mt-6 py-3 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-sm font-bold transition-all border border-indigo-500/20 flex items-center justify-center gap-2 group">
            View All Processes <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
    </div>
);

const SecurityPanel = () => (
    <div className="aurora-glass-card rounded-3xl p-6 border border-white/5">
        <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="text-emerald-400" size={24} />
            <h3 className="text-xl font-bold text-white">Security Cluster</h3>
        </div>

        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="text-emerald-500" size={18} />
                    <span className="text-sm font-medium text-slate-300">Firewall Status</span>
                </div>
                <span className="text-xs font-black text-emerald-500 uppercase">Active</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                <div className="flex items-center gap-3">
                    <Activity className="text-indigo-500" size={18} />
                    <span className="text-sm font-medium text-slate-300">Intrusion Detection</span>
                </div>
                <span className="text-xs font-black text-indigo-500 uppercase">Monitoring</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <span>Recent Login Attempts</span>
                    <span>Status</span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium border-b border-white/5 pb-2">
                    <span className="text-slate-400 italic">No suspicious activity detected.</span>
                </div>
            </div>
        </div>

        <button className="w-full mt-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-all border border-white/10 flex items-center justify-center gap-2">
            Access Security Logs
        </button>
    </div>
);

// --- Main Component ---

const AdvancedDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [history, setHistory] = useState({
        cpu: Array(20).fill(0).map((_, i) => ({ time: i, value: 0 })),
        ram: Array(20).fill(0).map((_, i) => ({ time: i, value: 0 }))
    });

    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get('/api/admin/system/stats');
            const data = res.data;
            setStats(data);

            setHistory(prev => ({
                cpu: [...prev.cpu.slice(1), { time: Date.now(), value: data.cpu.load }],
                ram: [...prev.ram.slice(1), { time: Date.now(), value: data.mem.usedPercent }]
            }));

            setLoading(false);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
            setError('System monitoring temporarily unavailable');
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // 5s poll
        return () => clearInterval(interval);
    }, [fetchData]);

    if (loading && !stats) {
        return (
            <div className="min-h-screen bg-transparent flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="text-indigo-500 animate-spin" size={48} />
                    <span className="text-slate-400 font-medium tracking-widest uppercase text-xs font-mono">Initializing Core Systems...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 pb-16 bg-slate-900/40 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
                        <Activity className="text-indigo-500" size={36} />
                        System Cluster
                    </h1>
                    <p className="text-slate-400 mt-2 flex items-center gap-2">
                        <ShieldCheck size={16} className="text-emerald-400" />
                        Infrastructure heartbeat is <span className="text-emerald-400 font-bold uppercase tracking-wider">Nominal</span>
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => fetchData()}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white group"
                    >
                        <RefreshCw size={20} className="group-active:rotate-180 transition-transform duration-500" />
                    </button>
                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-slate-300 font-mono">NODE_CLUSTER_01</span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-3 text-rose-400"
                    >
                        <AlertCircle size={20} />
                        <span className="text-sm font-bold uppercase tracking-wider">{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="CPU LOAD"
                    value={stats.cpu.load}
                    unit="%"
                    icon={Cpu}
                    color="#6366f1"
                    chartData={history.cpu}
                />
                <MetricCard
                    title="RAM USE"
                    value={stats.mem.usedPercent}
                    unit="%"
                    icon={Database}
                    color="#ec4899"
                    chartData={history.ram}
                />
                <MetricCard
                    title="DISK"
                    value={stats.storage[0]?.usePercent || 0}
                    unit="%"
                    icon={HardDrive}
                    color="#0ea5e9"
                    chartData={Array(20).fill({ value: stats.storage[0]?.usePercent || 0 })}
                />
                <MetricCard
                    title="TRAFFIC"
                    value={(stats.network.rx_sec / (1024 * 1024)).toFixed(1)}
                    unit="MB/s"
                    icon={Network}
                    color="#f59e0b"
                    chartData={Array(20).fill({ value: stats.network.rx_sec })}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 aurora-glass-card rounded-3xl p-8 border border-white/5">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="text-indigo-400" size={24} />
                            <h3 className="text-xl font-bold text-white">Performance Metrics</h3>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-black rounded-lg border border-indigo-500/30 uppercase tracking-widest">CPU</span>
                            <span className="px-3 py-1 bg-slate-800 text-slate-500 text-[10px] font-black rounded-lg border border-white/5 uppercase tracking-widest">RAM</span>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={history.cpu}>
                                <defs>
                                    <linearGradient id="colorCpuMain" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="time" hide />
                                <YAxis hide domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        borderColor: '#1e293b',
                                        borderRadius: '12px',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ display: 'none' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorCpuMain)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <ProcessList processes={stats.processes.list} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SecurityPanel />

                <div className="aurora-glass-card rounded-3xl p-6 border border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <HardDrive className="text-indigo-400" size={24} />
                        <h3 className="text-xl font-bold text-white">Storage Topology</h3>
                    </div>
                    <div className="space-y-6">
                        {stats.storage.map((disk, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-slate-300 uppercase tracking-wider">{disk.mount} ({disk.type})</span>
                                    <span className="text-slate-500 uppercase tracking-widest">{disk.usePercent}% FULL</span>
                                </div>
                                <div className="h-4 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5 relative">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${disk.usePercent}%` }}
                                        transition={{ duration: 2, ease: "easeOut" }}
                                        className={`h-full bg-gradient-to-r ${disk.usePercent > 90 ? 'from-rose-600 to-rose-400' : 'from-indigo-600 to-blue-400'}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between group cursor-pointer hover:bg-emerald-500/20 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <Zap size={24} />
                        </div>
                        <div>
                            <div className="text-lg font-bold text-emerald-400">Optimize Node Memory</div>
                            <div className="text-xs text-slate-400">Flush V8 heap and garbage collector</div>
                        </div>
                    </div>
                    <ChevronRight className="text-emerald-500 group-hover:translate-x-2 transition-transform" />
                </div>

                <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between group cursor-pointer hover:bg-indigo-500/20 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <RefreshCw size={24} />
                        </div>
                        <div>
                            <div className="text-lg font-bold text-indigo-400">Server Status Report</div>
                            <div className="text-xs text-slate-400">Generate full PDF diagnostic report</div>
                        </div>
                    </div>
                    <ChevronRight className="text-indigo-500 group-hover:translate-x-2 transition-transform" />
                </div>
            </div>
        </div>
    );
};

export default AdvancedDashboard;
