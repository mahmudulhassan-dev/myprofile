import React, { useState, useEffect } from 'react';
import { Layout, Clock, CheckSquare, MessageSquare, FileText, Download, Target } from 'lucide-react';

const ClientDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock fetch for now, will link to /api/projects/my-projects later
        fetch('/api/projects/my-projects')
            .then(res => res.json())
            .then(data => {
                setProjects(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                        Client <span className="text-indigo-600">Portal</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Track your project milestones, assets, and communications in real-time.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Project Overview Cards */}
                    <div className="lg:col-span-2 space-y-8">
                        {loading ? (
                            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                                <p className="text-slate-400 animate-pulse">Loading your projects...</p>
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50">
                                <Layout size={48} className="mx-auto text-slate-200 mb-4" />
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Active Projects</h3>
                                <p className="text-slate-500">Mahmudul will assign projects to your account soon.</p>
                            </div>
                        ) : (
                            projects.map(project => (
                                <ProjectCard key={project.id} project={project} />
                            ))
                        )}
                    </div>

                    {/* Sidebar Stats & Actions */}
                    <div className="space-y-8">
                        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/40 transition-colors"></div>
                            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                                <Target size={24} className="text-indigo-400" />
                                Growth Stats
                            </h3>
                            <div className="space-y-6">
                                <StatItem label="Active Projects" value={projects.length} />
                                <StatItem label="Milestones Completed" value="12" />
                                <StatItem label="Support Hours Used" value="4.5/10" />
                            </div>
                            <button className="w-full mt-8 py-4 bg-indigo-600 hover:bg-white hover:text-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all">
                                Open Support Ticket
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProjectCard = ({ project }) => (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 group">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-3xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Layout size={32} />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{project.title}</h3>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{project.status}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <ActionButton icon={<FileText size={18} />} label="Docs" />
                <ActionButton icon={<MessageSquare size={18} />} label="Chat" />
            </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
            <div className="flex justify-between items-end mb-3">
                <span className="text-sm font-bold text-slate-500">Development Progress</span>
                <span className="text-lg font-black text-indigo-600">{project.progress || 0}%</span>
            </div>
            <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    className="h-full bg-indigo-600 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                />
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <InfoBox icon={<Clock size={16} />} label="Days Spent" value="24" />
            <InfoBox icon={<CheckSquare size={16} />} label="Tasks Done" value="18/22" />
            <InfoBox icon={<Download size={16} />} label="Files" value="6" />
            <InfoBox icon={<Target size={16} />} label="Next Goal" value="UI Polish" />
        </div>
    </div>
);

const StatItem = ({ label, value }) => (
    <div className="flex justify-between items-center">
        <span className="text-slate-400 font-medium text-sm">{label}</span>
        <span className="text-xl font-black">{value}</span>
    </div>
);

const ActionButton = ({ icon, label }) => (
    <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl hover:bg-slate-900 hover:text-white transition-all border border-slate-100 dark:border-slate-600 font-bold text-xs uppercase tracking-widest">
        {icon} {label}
    </button>
);

const InfoBox = ({ icon, label, value }) => (
    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600/50">
        <div className="flex items-center gap-2 text-slate-400 mb-2">
            {icon}
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <p className="text-sm font-black text-slate-800 dark:text-white">{value}</p>
    </div>
);

export default ClientDashboard;
