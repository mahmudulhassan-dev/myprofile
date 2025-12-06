import React, { useEffect, useState } from 'react';
import { DollarSign, Briefcase, CheckCircle, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const ProjectDashboard = ({ onCreate }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/projects/stats', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-400">Loading analytics...</div>;
    if (!stats) return <div className="p-8 text-center text-red-400">Failed to load analytics</div>;

    const StatCard = ({ title, value, icon: Icon, color, prefix = '' }) => (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
                <div className="text-2xl font-extrabold text-slate-800 mt-1">{prefix}{value}</div>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
        </div>
    );

    const data = stats.byCategory?.map(c => ({ name: c.type, value: c.count })) || [];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={stats.revenue?.toLocaleString()} prefix="$" icon={DollarSign} color="bg-green-500" />
                <StatCard title="Total Projects" value={stats.total} icon={Briefcase} color="bg-blue-500" />
                <StatCard title="Completed" value={stats.completed} icon={CheckCircle} color="bg-purple-500" />
                <StatCard title="In Progress" value={stats.inProgress} icon={Clock} color="bg-orange-500" />
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profit/Loss Badge */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
                    <div className="text-sm font-bold text-slate-400 uppercase mb-2">Net Profit</div>
                    <div className={`text-5xl font-extrabold ${stats.profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        ${stats.profit?.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-400 mt-4">Calculated from Revenue - Expenses</p>
                </div>

                {/* Category Distribution */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-700 mb-4 text-center">Project Distribution</h4>
                    <div className="h-64">
                        {data.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400 text-sm">No data available</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions Placeholder */}
            {stats.total === 0 && (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500 mb-4">No projects found. Start building your portfolio!</p>
                    <button onClick={onCreate} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
                        Create First Project
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProjectDashboard;
