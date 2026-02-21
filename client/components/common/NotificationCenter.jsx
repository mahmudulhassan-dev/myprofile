import React, { useState } from 'react';
import { Bell, X, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useSocket } from '../../context/SocketContext';

const NotificationCenter = () => {
    const { notifications, clearNotifications } = useSocket();
    const [isOpen, setIsOpen] = useState(false);

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle className="text-green-500" size={18} />;
            case 'warning': return <AlertTriangle className="text-amber-500" size={18} />;
            default: return <Info className="text-indigo-500" size={18} />;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-all"
            >
                <Bell size={20} />
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 animate-pulse">
                        {notifications.length}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute right-0 mt-3 w-80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-[0_25px_60px_rgba(0,0,0,0.15)] border border-white/20 dark:border-white/10 p-6 z-[101] overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Activity</h4>
                            <button onClick={clearNotifications} className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700">Clear All</button>
                        </div>

                        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Bell size={24} className="text-slate-300" />
                                    </div>
                                    <p className="text-slate-400 text-sm font-medium">All caught up!</p>
                                </div>
                            ) : (
                                notifications.map((notif, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="flex gap-4 p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/50 dark:border-slate-700/50 shadow-sm"
                                    >
                                        <div className="mt-1">{getIcon(notif.type)}</div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight mb-1">{notif.title}</p>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{notif.message}</p>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationCenter;
