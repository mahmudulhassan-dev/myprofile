import React, { useState, useEffect, useCallback } from 'react';
import {
    MessageSquare, CheckCircle2, XCircle, Trash2,
    Star, ShieldAlert, Clock, ChevronRight,
    AtSign, User, ExternalLink, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const ReviewManager = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchReviews = useCallback(async () => {
        try {
            setRefreshing(true);
            const res = await axios.get('/api/admin/products/reviews');
            setReviews(res.data);
            setLoading(false);
            setRefreshing(false);
        } catch (err) {
            console.error('Fetch reviews error:', err);
            toast.error('Neural feedback sync failed');
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        if (isMounted) fetchReviews();
        return () => { isMounted = false; };
    }, [fetchReviews]);

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`/api/admin/products/reviews/${id}/status`, { status });
            toast.success(`Review ${status}`);
            fetchReviews();
        } catch (err) {
            toast.error('Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Erase this neural footprint (Delete Review)?')) return;
        try {
            await axios.delete(`/api/admin/products/reviews/${id}`);
            toast.success('Review erased');
            fetchReviews();
        } catch (err) {
            toast.error('Deletion failed');
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
            <RefreshCw className="animate-spin text-amber-500" size={32} />
            <p className="animate-pulse tracking-widest text-xs uppercase font-bold text-amber-500/50">Filtering Global Feedback...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Sentience Guard</h1>
                    <p className="text-slate-500 mt-1 font-medium flex items-center gap-2">
                        <MessageSquare size={16} className="text-amber-500" />
                        Reputation Moderation Center
                    </p>
                </div>
                <button
                    onClick={fetchReviews}
                    disabled={refreshing}
                    className="aurora-glass-card px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-all flex items-center gap-2 border border-white/5 active:scale-95"
                >
                    <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Sync Feedback</span>
                </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="aurora-glass-card p-6 rounded-3xl border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Pending Sync</p>
                    <h3 className="text-3xl font-bold text-amber-400">{reviews.filter(r => r.status === 'pending').length}</h3>
                </div>
                <div className="aurora-glass-card p-6 rounded-3xl border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Approved Pulse</p>
                    <h3 className="text-3xl font-bold text-emerald-400">{reviews.filter(r => r.status === 'approved').length}</h3>
                </div>
                <div className="aurora-glass-card p-6 rounded-3xl border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Global Average</p>
                    <h3 className="text-3xl font-bold text-blue-400">4.8 <span className="text-xs font-normal text-slate-500 tracking-tight">Neurons</span></h3>
                </div>
            </div>

            {/* Moderation Queue */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {reviews.map((review) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={review.id}
                            className="aurora-glass-card p-6 rounded-[2rem] border border-white/5 group hover:border-white/10 transition-all"
                        >
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Left: Reviewer and Product Info */}
                                <div className="lg:w-1/4 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white tracking-tight truncate w-32">{review.guest_name}</p>
                                            <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                                <AtSign size={10} /> {review.guest_email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-[9px] uppercase font-bold text-slate-500 tracking-widest mb-2">Subject Link</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-800 overflow-hidden border border-white/5">
                                                {review.Product?.featured_image ?
                                                    <img src={review.Product.featured_image} className="w-full h-full object-cover" alt="" /> :
                                                    <div className="w-full h-full flex items-center justify-center text-slate-600 text-[8px]">P</div>
                                                }
                                            </div>
                                            <p className="text-[11px] font-bold text-slate-300 truncate w-24">{review.Product?.title || 'Unknown Asset'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Center: Review Content */}
                                <div className="lg:w-1/2 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                            <Clock size={12} /> {new Date(review.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                        {review.comment || <span className="italic text-slate-500">No telemetry comment provided.</span>}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${review.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                                                review.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' :
                                                    'bg-rose-500/20 text-rose-400 border border-rose-500/20'
                                            }`}>
                                            {review.status} Mask
                                        </span>
                                    </div>
                                </div>

                                {/* Right: Action Matrix */}
                                <div className="lg:w-1/4 flex lg:flex-col justify-end gap-2 pr-2">
                                    {review.status !== 'approved' && (
                                        <button
                                            onClick={() => handleStatusUpdate(review.id, 'approved')}
                                            className="flex-1 lg:flex-none py-2 px-4 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/20 hover:bg-emerald-500/30 transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 size={16} /> Authorize
                                        </button>
                                    )}
                                    {review.status !== 'spam' && (
                                        <button
                                            onClick={() => handleStatusUpdate(review.id, 'spam')}
                                            className="flex-1 lg:flex-none py-2 px-4 rounded-xl bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/20 hover:bg-amber-500/30 transition-all flex items-center justify-center gap-2"
                                        >
                                            <ShieldAlert size={16} /> Quarantine
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        className="py-2 px-4 rounded-xl bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/20 hover:bg-rose-500/30 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={16} /> Erase
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {reviews.length === 0 && (
                    <div className="aurora-glass-card py-20 rounded-[3rem] flex flex-col items-center justify-center border border-white/5 opacity-50">
                        <MessageSquare size={48} className="text-slate-600 mb-4" />
                        <h3 className="text-xl font-bold text-slate-500">Neural Silence</h3>
                        <p className="text-slate-600 text-sm">No incoming feedback streams detected.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewManager;
