import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
    Smartphone, CheckCircle2, XCircle, Clock,
    RefreshCw, Search, Filter, TrendingUp,
    BadgeCheck, AlertTriangle, Eye
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// ── Provider Badge ───────────────────────────────────────────────────────────
const ProviderBadge = ({ provider }) => {
    const map = {
        bkash: { label: 'bKash', bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20' },
        nagad: { label: 'Nagad', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
        rocket: { label: 'Rocket', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
    };
    const p = map[provider?.toLowerCase()] || { label: provider, bg: 'bg-slate-800', text: 'text-slate-400', border: 'border-white/5' };

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest border ${p.bg} ${p.text} ${p.border}`}>
            <Smartphone size={10} /> {p.label}
        </span>
    );
};

// ── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const map = {
        Pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
        Paid: { icon: BadgeCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        Rejected: { icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
        Processing: { icon: CheckCircle2, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    };
    const s = map[status] || map.Pending;
    const Icon = s.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${s.bg} ${s.color} ${s.border}`}>
            <Icon size={10} /> {status}
        </span>
    );
};

// ── Order Row ────────────────────────────────────────────────────────────────
const OrderRow = React.memo(({ order, onAction, busy }) => (
    <tr
        className="border-b border-white/5 hover:bg-white/5 transition-colors"
    >
        <td className="px-6 py-4">
            <div className="font-mono text-xs text-slate-300 bg-white/5 px-3 py-1.5 rounded-xl inline-block border border-white/10 max-w-[140px] truncate">
                {order.transactionID}
            </div>
        </td>
        <td className="px-6 py-4">
            <ProviderBadge provider={order.mfsProvider || order.paymentMethod} />
        </td>
        <td className="px-6 py-4">
            <div className="text-white font-bold">৳ {parseFloat(order.amount || 0).toLocaleString()}</div>
        </td>
        <td className="px-6 py-4">
            <div className="text-sm text-slate-300 font-medium">{order.customerName || '—'}</div>
            <div className="text-xs text-slate-500 font-mono">{order.customerPhone}</div>
        </td>
        <td className="px-6 py-4">
            <StatusBadge status={order.payment_status} />
        </td>
        <td className="px-6 py-4 text-xs text-slate-500 font-mono">
            {new Date(order.createdAt).toLocaleString('en-BD', { dateStyle: 'short', timeStyle: 'short' })}
        </td>
        <td className="px-6 py-4">
            {order.payment_status === 'Unpaid' ? (
                <div className="flex gap-2">
                    <button
                        onClick={() => onAction(order.id, 'approve')}
                        disabled={busy === order.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold border border-emerald-500/20 transition-all disabled:opacity-40"
                    >
                        <CheckCircle2 size={12} /> Approve
                    </button>
                    <button
                        onClick={() => onAction(order.id, 'reject')}
                        disabled={busy === order.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-bold border border-rose-500/20 transition-all disabled:opacity-40"
                    >
                        <XCircle size={12} /> Reject
                    </button>
                </div>
            ) : (
                <span className="text-xs text-slate-600 italic">—</span>
            )}
        </td>
    </tr>
));
OrderRow.displayName = 'OrderRow';


// ── Main Component ────────────────────────────────────────────────────────────
const MfsOrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');   // all | Unpaid | Paid | Rejected
    const [search, setSearch] = useState('');
    const [busy, setBusy] = useState(null);    // order id being actioned

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/mfs/orders');
            setOrders(res.data.orders || []);
        } catch {
            toast.error('Failed to load MFS orders');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const handleAction = async (id, action) => {
        setBusy(id);
        try {
            await axios.patch(`/api/mfs/orders/${id}`, { action });
            toast.success(`Order ${action}d successfully`);
            // Update status optimistically
            setOrders(prev => prev.map(o =>
                o.id === id
                    ? { ...o, payment_status: action === 'approve' ? 'Paid' : 'Rejected', status: action === 'approve' ? 'Processing' : 'Cancelled' }
                    : o
            ));
        } catch (err) {
            toast.error(err.response?.data?.error || `Failed to ${action} order`);
        } finally {
            setBusy(null);
        }
    };

    // Computed stats
    const pending = orders.filter(o => o.payment_status === 'Unpaid').length;
    const approved = orders.filter(o => o.payment_status === 'Paid').length;
    const rejected = orders.filter(o => o.payment_status === 'Rejected').length;

    const filtered = orders.filter(o => {
        const matchStatus = filter === 'all' || o.payment_status === filter;
        const matchSearch = !search || [o.transactionID, o.customerName, o.customerPhone, o.customerEmail]
            .join(' ').toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                        <Smartphone className="text-pink-500" size={36} />
                        MFS Orders
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium flex items-center gap-2">
                        <TrendingUp size={16} className="text-pink-500" />
                        bKash · Nagad · Rocket — Manual Confirmation Queue
                    </p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Pending', count: pending, color: 'amber', icon: Clock },
                    { label: 'Approved', count: approved, color: 'emerald', icon: BadgeCheck },
                    { label: 'Rejected', count: rejected, color: 'rose', icon: AlertTriangle },
                ].map(({ label, count, color, icon: Icon }) => (
                    <div key={label} className={`aurora-glass-card rounded-3xl p-6 border border-white/5 flex items-center gap-4`}>
                        <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-400`}>
                            <Icon size={22} />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white">{count}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters & Search */}
            <div className="aurora-glass-card rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 bg-white/40 flex flex-col md:flex-row gap-4 justify-between items-center">
                    {/* Status Filter */}
                    <div className="flex gap-2">
                        {['all', 'Unpaid', 'Paid', 'Rejected'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${filter === f
                                    ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/20'
                                    : 'bg-white/30 text-slate-600 border-white/20 hover:bg-white/50'
                                    }`}
                            >
                                {f === 'all' ? 'All' : f === 'Unpaid' ? 'Pending' : f}
                            </button>
                        ))}
                    </div>
                    {/* Search */}
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search TrxID, phone, name…"
                            className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all font-medium"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-48 gap-3 text-slate-400">
                            <RefreshCw className="animate-spin text-purple-500" size={24} />
                            <span className="text-sm font-bold uppercase tracking-widest">Loading Orders…</span>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                            <Eye size={40} className="opacity-20 mb-3" />
                            <p className="text-sm font-bold uppercase tracking-widest opacity-40">No orders found</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                                    {['TrxID', 'Provider', 'Amount', 'Customer', 'Status', 'Submitted', 'Actions'].map(h => (
                                        <th key={h} className="px-6 py-4 font-black">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence mode="popLayout">
                                    {filtered.map(order => (
                                        <OrderRow
                                            key={order.id}
                                            order={order}
                                            onAction={handleAction}
                                            busy={busy}
                                        />
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer count */}
                {!loading && (
                    <div className="px-6 py-4 border-t border-white/5 bg-white/20 flex items-center gap-2">
                        <Filter size={12} className="text-slate-400" />
                        <span className="text-xs text-slate-400 font-bold">
                            {filtered.length} order{filtered.length !== 1 ? 's' : ''} shown
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MfsOrderManager;
