import React, { useState, useEffect, useCallback } from 'react';
import {
    Package, Search, Filter, ArrowUpDown,
    CheckCircle2, AlertCircle, Edit3, Save, X,
    ChevronLeft, ChevronRight, Loader2, RefreshCw
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const StockManager = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [stockStatus, setStockStatus] = useState('all');

    const fetchStock = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/admin/products', {
                params: {
                    page,
                    search,
                    stock_status: stockStatus,
                    limit: 10
                }
            });
            setProducts(res.data.products);
            setTotalPages(res.data.pages);
            setLoading(false);
        } catch (err) {
            console.error('Stock fetch error:', err);
            toast.error('Failed to sync inventory');
            setLoading(false);
        }
    }, [page, search, stockStatus]);

    useEffect(() => {
        let isMounted = true;
        if (isMounted) fetchStock();
        return () => { isMounted = false; };
    }, [fetchStock]);

    const handleUpdateStock = async (product) => {
        try {
            const newStatus = parseInt(editValue) <= 0 ? 'outofstock' :
                (parseInt(editValue) <= (product.low_stock_threshold || 5) ? 'instock' : 'instock');

            // Note: Our logic might vary based on requirements, but generally:
            const statusToSet = parseInt(editValue) <= 0 ? 'outofstock' : 'instock';

            await axios.put(`/api/admin/products/${product.id}/stock`, {
                stock_quantity: parseInt(editValue),
                stock_status: statusToSet,
                manage_stock: true
            });

            toast.success(`${product.title} updated`);
            setEditingId(null);
            fetchStock();
        } catch (err) {
            toast.error('Update failed');
        }
    };

    const getStatusStyle = (status, qty, threshold) => {
        if (status === 'outofstock' || qty <= 0) return 'bg-rose-500/20 text-rose-400 border-rose-500/20';
        if (qty <= (threshold || 5)) return 'bg-amber-500/20 text-amber-400 border-amber-500/20';
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Depletion Shield</h1>
                    <p className="text-slate-500 mt-1 font-medium flex items-center gap-2">
                        <Package size={16} className="text-blue-500" />
                        Inventory Control Center
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="aurora-glass-card flex items-center px-4 py-2 border border-white/5 rounded-2xl focus-within:border-blue-500/50 transition-all">
                        <Search size={18} className="text-slate-500" />
                        <input
                            type="text"
                            placeholder="Identify SKU or Cluster..."
                            className="bg-transparent border-none outline-none text-sm text-white px-3 w-48 lg:w-64"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                {['all', 'instock', 'outofstock'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStockStatus(status)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${stockStatus === status
                            ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                            : 'aurora-glass-card text-slate-400 border-white/5 hover:border-white/10'
                            }`}
                    >
                        {status}
                    </button>
                ))}
                <button
                    onClick={fetchStock}
                    className="ml-auto aurora-glass-card p-2 rounded-xl text-slate-400 hover:text-white border border-white/5"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Inventory Table */}
            <div className="aurora-glass-card rounded-[2.5rem] overflow-hidden border border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-[11px] uppercase tracking-[0.2em] font-bold text-slate-500">
                                <th className="px-8 py-5">Product Cluster</th>
                                <th className="px-6 py-5">Signature (SKU)</th>
                                <th className="px-6 py-5">Status Mask</th>
                                <th className="px-6 py-5 text-center">Unit Reserve</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {products.map((p) => (
                                    <motion.tr
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        key={p.id}
                                        className="group hover:bg-white/5 transition-all"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4 text-slate-200">
                                                <div className="w-10 h-10 rounded-xl bg-slate-800 overflow-hidden border border-white/5">
                                                    {p.featured_image ?
                                                        <img src={p.featured_image} className="w-full h-full object-cover" alt="" /> :
                                                        <div className="w-full h-full flex items-center justify-center text-slate-600">P</div>
                                                    }
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm tracking-tight group-hover:text-blue-400 transition-colors uppercase">{p.title}</p>
                                                    <p className="text-[10px] text-slate-500 font-medium">৳{p.sale_price || '-'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-mono text-slate-400 px-2 py-1 bg-white/5 rounded-md border border-white/5">{p.sku || 'N/A'}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-widest ${getStatusStyle(p.stock_status, p.stock_quantity, p.low_stock_threshold)}`}>
                                                {p.stock_status === 'instock' ? (p.stock_quantity <= (p.low_stock_threshold || 5) ? 'Low Energy' : 'Stable') : 'Depleted'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            {editingId === p.id ? (
                                                <div className="flex items-center justify-center gap-2 animate-in zoom-in-95">
                                                    <input
                                                        autoFocus
                                                        type="number"
                                                        className="w-20 bg-slate-900 border border-blue-500/50 rounded-lg px-2 py-1 text-xs text-white outline-none"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleUpdateStock(p)}
                                                    />
                                                </div>
                                            ) : (
                                                <span className={`text-sm font-bold ${p.stock_quantity <= (p.low_stock_threshold || 5) ? 'text-rose-400' : 'text-slate-200'}`}>
                                                    {p.stock_quantity}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {editingId === p.id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStock(p)}
                                                            className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all"
                                                        >
                                                            <Save size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingId(null)}
                                                            className="p-2 text-slate-400 hover:bg-white/10 rounded-lg transition-all"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(p.id);
                                                            setEditValue(p.stock_quantity.toString());
                                                        }}
                                                        className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-5 border-t border-white/5 bg-white/5 flex items-center justify-between">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sector {page} of {totalPages}</p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="p-2 aurora-glass-card rounded-xl border border-white/5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="p-2 aurora-glass-card rounded-xl border border-white/5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockManager;
