import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, count, icon: Icon, color, trend, trendValue }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden`}
        >
            <div className={`absolute top-0 right-0 p-4 opacity-10`}>
                <Icon size={64} className={color} />
            </div>

            <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg bg-slate-700/50 ${color}`}>
                    <Icon size={24} />
                </div>
                <h3 className="text-slate-400 font-medium">{title}</h3>
            </div>

            <div className="flex items-end gap-2">
                <h2 className="text-3xl font-bold text-white">{count}</h2>
                {trend && (
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${trend === 'up' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                        {trend === 'up' ? '↑' : '↓'} {trendValue}%
                    </span>
                )}
            </div>
        </motion.div>
    );
};

export default StatCard;
