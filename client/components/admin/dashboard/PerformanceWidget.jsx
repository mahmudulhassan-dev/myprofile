import React from 'react';
import { Activity, Server, Database, Clock } from 'lucide-react';

const PerformanceWidget = ({ stats }) => {
    if (!stats) return <div className="text-slate-500">Loading Stats...</div>;

    const Metric = ({ label, value, icon: Icon, color }) => (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <Icon size={18} className="text-slate-400" />
                <span className="text-slate-300 font-medium">{label}</span>
            </div>
            <div className="flex items-center gap-3 w-1/2">
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full ${color}`}
                        style={{ width: `${Math.min(value, 100)}%` }}
                    ></div>
                </div>
                <span className="text-white text-sm font-bold w-12 text-right">{value}%</span>
            </div>
        </div>
    );

    return (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="text-blue-500" /> System Health
            </h3>

            <Metric label="CPU Usage" value={stats.cpu} icon={Server} color="bg-blue-500" />
            <Metric label="RAM Usage" value={stats.memory} icon={Database} color="bg-purple-500" />
            <Metric label="Disk Usage" value={stats.disk} icon={Database} color="bg-orange-500" />

            <div className="mt-6 pt-4 border-t border-slate-700 flex justify-between items-center">
                <span className="text-slate-400 text-sm flex items-center gap-2">
                    <Clock size={14} /> Uptime
                </span>
                <span className="text-white font-mono">
                    {Math.floor(stats.uptime / 3600)}h {Math.floor((stats.uptime % 3600) / 60)}m
                </span>
            </div>
        </div>
    );
};

export default PerformanceWidget;
