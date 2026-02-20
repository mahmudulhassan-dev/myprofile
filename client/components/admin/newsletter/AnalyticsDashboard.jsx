import React from 'react';
import { BarChart2, TrendingUp, Users, Mail } from 'lucide-react';

const AnalyticsDashboard = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="font-bold text-lg text-slate-700">Performance Overview</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-slate-500">
                        <Mail size={18} /> <span className="text-xs font-bold uppercase">Open Rate</span>
                    </div>
                    <h4 className="text-3xl font-extrabold text-slate-800">24.8%</h4>
                    <span className="text-xs text-green-500 font-bold flex items-center gap-1">
                        <TrendingUp size={12} /> +2.4% vs last month
                    </span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-slate-500">
                        <Users size={18} /> <span className="text-xs font-bold uppercase">Click Rate</span>
                    </div>
                    <h4 className="text-3xl font-extrabold text-slate-800">5.2%</h4>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-400 py-20">
                <BarChart2 className="mx-auto mb-2 opacity-50" size={48} />
                <p className="font-medium">Detailed Analytics Charts Coming Soon</p>
                <p className="text-xs mt-2">Requires logging data over time.</p>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
