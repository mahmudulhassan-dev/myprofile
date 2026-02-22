
import React, { useState, useEffect } from 'react';
import {
    TrendingUp, Package, ShoppingCart, Users,
    ArrowUpRight, ArrowDownRight, Activity,
    Zap, Target, RefreshCw, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const ProductAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [timeframe, setTimeframe] = useState('7d');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // In a real app, this would be a real API call
                // For now, we simulate a deep engine response
                await new Promise(r => setTimeout(r, 1500));
                setData({
                    summary: [
                        { label: 'Total Revenue', value: '$124,500', trend: 12.5, icon: TrendingUp, color: 'text-emerald-500' },
                        { label: 'Conversion Rate', value: '3.8%', trend: -2.1, icon: Target, color: 'text-blue-500' },
                        { label: 'Avg Order Value', value: '$85.20', trend: 5.4, icon: ShoppingCart, color: 'text-purple-500' },
                        { label: 'Active Sessions', value: '1,240', trend: 18.2, icon: Activity, color: 'text-orange-500' }
                    ],
                    salesPerformance: [
                        { name: 'Mon', revenue: 4000, orders: 240 },
                        { name: 'Tue', revenue: 3000, orders: 198 },
                        { name: 'Wed', revenue: 2000, orders: 150 },
                        { name: 'Thu', revenue: 2780, orders: 210 },
                        { name: 'Fri', revenue: 1890, orders: 120 },
                        { name: 'Sat', revenue: 2390, orders: 180 },
                        { name: 'Sun', revenue: 3490, orders: 250 }
                    ],
                    topProducts: [
                        { name: 'Neural Processor X1', sales: 450, stock: 12, growth: 85 },
                        { name: 'Quantum Display 32', sales: 320, stock: 45, growth: 62 },
                        { name: 'Bio-Link Connector', sales: 280, stock: 8, growth: 45 },
                        { name: 'Holo-Projection Deck', sales: 210, stock: 24, growth: 30 }
                    ]
                });
            } catch (error) {
                console.error('Analytics Fetch Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [timeframe]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-purple-500">
            <RefreshCw className="animate-spin" size={32} />
            <p className="animate-pulse tracking-widest text-xs uppercase font-bold">Initializing Deep Intelligence Engine...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-1000">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Catalog Intelligence</h1>
                    <p className="text-slate-500 mt-1 font-medium flex items-center gap-2">
                        <Zap size={16} className="text-purple-500" />
                        Aesthetic Predictive Analytics Engine
                    </p>
                </div>
                <div className="flex bg-white/50 p-1 rounded-2xl border border-slate-200">
                    {['24h', '7d', '30d', '1y'].map(t => (
                        <button
                            key={t}
                            onClick={() => setTimeframe(t)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${timeframe === t ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            {t.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.summary.map((kpi, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="aurora-glass-card p-6 rounded-[2rem] border border-white/10 shadow-xl hover:shadow-2xl transition-all group"
                    >
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-2xl bg-white/80 shadow-sm ${kpi.color}`}>
                                <kpi.icon size={20} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold ${kpi.trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {kpi.trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {Math.abs(kpi.trend)}%
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                            <h2 className="text-3xl font-black text-slate-800 mt-1">{kpi.value}</h2>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Timeline */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-2 aurora-glass-card rounded-[2.5rem] border border-white/10 p-8 shadow-2xl overflow-hidden"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-extrabold text-slate-800">Revenue Trajectory</h3>
                            <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">Growth Matrix Visualization</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500 shadow-lg shadow-purple-500/20" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Gross Revenue</span>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.salesPerformance}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255,255,255,0.8)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '20px',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#9333ea"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorRev)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Top Performers */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="aurora-glass-card rounded-[2.5rem] border border-white/10 p-8 shadow-2xl"
                >
                    <h3 className="text-xl font-extrabold text-slate-800 mb-6">Top Performers</h3>
                    <div className="space-y-6">
                        {data.topProducts.map((p, i) => (
                            <div key={i} className="group relative">
                                <div className="flex justify-between items-end mb-2">
                                    <div className="max-w-[150px]">
                                        <h4 className="text-sm font-bold text-slate-700 truncate group-hover:text-purple-600 transition-colors">{p.name}</h4>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.sales} Sales</p>
                                    </div>
                                    <span className="text-xs font-black text-emerald-500">+{p.growth}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${p.growth}%` }}
                                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-lg shadow-purple-500/20"
                                    />
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className={`text-[10px] font-bold ${p.stock < 15 ? 'text-rose-500' : 'text-slate-400'}`}>
                                        Stock: {p.stock}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all">
                        Deep Export Data
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductAnalytics;
