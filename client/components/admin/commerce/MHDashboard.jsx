import React, { useState, useEffect, useCallback } from 'react';
import {
    BarChart2, TrendingUp, ShoppingBag, AlertCircle,
    ArrowUpRight, ArrowDownRight, Package, Clock,
    ChevronRight, ExternalLink, RefreshCw
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, unit, icon: IconComponent, color, trend, trendValue }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="aurora-glass-card p-6 rounded-3xl relative overflow-hidden group"
    >
        <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-125 duration-500">
            <IconComponent size={80} color={color} />
        </div>

        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <IconComponent size={20} color={color} />
                </div>
                <span className="text-sm font-medium text-slate-400 uppercase tracking-widest">{title}</span>
            </div>

            <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
                <span className="text-slate-500 font-medium">{unit}</span>
            </div>

            {trend && (
                <div className={`mt-4 flex items-center gap-1.5 text-xs font-bold ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {trendValue}
                    <span className="text-slate-500 font-normal ml-1">vs last month</span>
                </div>
            )}
        </div>
    </motion.div>
);

const MHDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setRefreshing(true);
            const res = await axios.get('/api/admin/dashboard/commerce');
            setStats(res.data);
            setLoading(false);
            setRefreshing(false);
        } catch (err) {
            console.error('Failed to fetch commerce stats:', err);
            toast.error('Failed to sync store diagnostics');
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        const safeFetch = () => {
            if (isMounted) fetchData();
        };

        safeFetch();
        const interval = setInterval(safeFetch, 30000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [fetchData]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
            <RefreshCw className="animate-spin text-blue-500" size={32} />
            <p className="animate-pulse tracking-widest text-xs uppercase font-bold">Synchronizing Store Cluster...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Commerce Cluster</h1>
                    <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live Store Telemetry
                    </p>
                </div>
                <button
                    onClick={fetchData}
                    disabled={refreshing}
                    className="aurora-glass-card px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-all flex items-center gap-2 border border-white/5 active:scale-95"
                >
                    <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                    <span className="text-xs font-bold uppercase tracking-wider">Reset Stream</span>
                </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Gross Revenue"
                    value={stats.summary.revenue.toLocaleString()}
                    unit="BDT"
                    icon={TrendingUp}
                    color="#6366f1"
                    trend="up"
                    trendValue="+12.5%"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.summary.orders}
                    unit="Vol"
                    icon={ShoppingBag}
                    color="#0ea5e9"
                />
                <StatCard
                    title="Pending Task"
                    value={stats.summary.pendingOrders}
                    unit="Orders"
                    icon={Clock}
                    color="#f59e0b"
                />
                <StatCard
                    title="Inventory Risk"
                    value={stats.summary.lowStockCount}
                    unit="SKUs"
                    icon={AlertCircle}
                    color="#f43f5e"
                    trend={stats.summary.lowStockCount > 10 ? 'down' : 'up'}
                    trendValue={stats.summary.lowStockCount > 10 ? "Critical" : "Stable"}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Topology */}
                <div className="lg:col-span-2 aurora-glass-card p-8 rounded-[2.5rem] border border-white/5">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white">Revenue Topology</h3>
                            <p className="text-slate-500 text-sm mt-1">Monthly performance distribution</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase rounded-full border border-blue-500/20">Real-time</span>
                        </div>
                    </div>

                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.revenueChart}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="month" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }}
                                    itemStyle={{ color: '#6366f1' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Selling Cluster */}
                <div className="aurora-glass-card p-8 rounded-[2.5rem] border border-white/5">
                    <h3 className="text-xl font-bold text-white mb-6">Velocity Mapping</h3>
                    <div className="space-y-6">
                        {stats.topProducts.map((p, idx) => (
                            <div key={p.id} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 -m-2 rounded-2xl transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden relative">
                                        {p.featured_image ?
                                            <img src={p.featured_image} className="w-full h-full object-cover" alt="" /> :
                                            <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">P</div>
                                        }
                                        <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white truncate w-32">{p.title}</p>
                                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{p.sales_count} Multi-sales</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-emerald-400">৳{p.sale_price || '-'}</p>
                                    <p className="text-[10px] text-slate-500 font-bold">#{idx + 1}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold text-slate-400 hover:text-white transition-all border border-white/5 flex items-center justify-center gap-2">
                        Full Catalog <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Neural Logs (Orders) */}
                <div className="aurora-glass-card p-8 rounded-[2.5rem] border border-white/5">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Clock size={20} className="text-blue-400" /> Recent Stream
                        </h3>
                        <a href="/admin/orders" className="text-xs font-bold text-blue-400 hover:underline">Stream All</a>
                    </div>

                    <div className="space-y-4">
                        {stats.recentOrders.map(order => (
                            <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
                                        <ShoppingBag size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{order.transactionID?.slice(0, 8)}</p>
                                        <p className="text-[10px] text-slate-500 font-medium">{order.customerName} • {new Date(order.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-white">৳{order.amount}</p>
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${order.payment_status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                            {order.payment_status}
                                        </span>
                                    </div>
                                    <ChevronRight className="text-slate-600 group-hover:text-white transition-colors" size={16} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inventory Risk Grid */}
                <div className="aurora-glass-card p-8 rounded-[2.5rem] border border-white/5">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Package size={20} className="text-rose-400" /> Depletion Shield
                        </h3>
                        <span className="px-2 py-1 bg-rose-500/20 text-rose-400 text-[10px] font-bold rounded-md">Critical Mask</span>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-white/5">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                                <tr>
                                    <th className="px-4 py-3">Product Cluster</th>
                                    <th className="px-4 py-3">Vector</th>
                                    <th className="px-4 py-3 text-right">Unit Reserve</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {stats.lowStockProducts.map(p => (
                                    <tr key={p.id} className="text-xs hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 font-bold text-slate-300">{p.title}</td>
                                        <td className="px-4 py-3 text-slate-500 font-mono">{p.sku || '-'}</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={`font-bold ${p.stock_quantity <= 2 ? 'text-rose-400' : 'text-amber-400'}`}>
                                                {p.stock_quantity}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {stats.lowStockProducts.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-4 py-10 text-center text-slate-500 font-medium">No active depletion alerts</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MHDashboard;
