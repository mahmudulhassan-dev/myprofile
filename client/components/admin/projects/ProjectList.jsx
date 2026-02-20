import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit2, Trash2, Eye, MoreHorizontal, ArrowUpRight, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectList = ({ onEdit }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ status: 'All', search: '' });

    useEffect(() => {
        fetchProjects();
    }, [filter]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams(filter).toString();
            const res = await fetch(`/api/projects?${query}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setProjects(data.projects || []);
        } catch (error) { toast.error('Failed to load projects'); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Move to trash?')) return;
        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                toast.success('Moved to trash');
                fetchProjects();
            }
        } catch (error) { toast.error('Delete failed'); }
    };

    const StatusBadge = ({ status }) => {
        const colors = {
            published: 'bg-green-100 text-green-700',
            draft: 'bg-slate-100 text-slate-600',
            'in-progress': 'bg-blue-100 text-blue-600',
            completed: 'bg-purple-100 text-purple-600',
            archived: 'bg-orange-100 text-orange-600',
            cancelled: 'bg-red-100 text-red-600',
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide ${colors[status] || 'bg-slate-100'}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
                        value={filter.search}
                        onChange={e => setFilter({ ...filter, search: e.target.value })}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <select
                        className="px-4 py-2 border rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
                        value={filter.status}
                        onChange={e => setFilter({ ...filter, status: e.target.value })}
                    >
                        <option value="All">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                        <tr>
                            <th className="p-4 w-16">Image</th>
                            <th className="p-4">Project</th>
                            <th className="p-4">Status & Progress</th>
                            <th className="p-4">Financials</th>
                            <th className="p-4">Created</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="6" className="p-8 text-center text-slate-400">Loading projects...</td></tr>
                        ) : projects.length === 0 ? (
                            <tr><td colSpan="6" className="p-8 text-center text-slate-400">No projects found.</td></tr>
                        ) : (
                            projects.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50 transition">
                                    <td className="p-4">
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                                            {p.thumbnail ? (
                                                <img src={p.thumbnail} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300"><Eye size={16} /></div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">{p.title}</div>
                                        <div className="text-xs text-slate-500 capitalize">{p.type} • {p.client_name || 'Internal'}</div>
                                    </td>
                                    <td className="p-4 min-w-[140px]">
                                        <div className="flex justify-between mb-1">
                                            <StatusBadge status={p.status} />
                                            <span className="text-[10px] font-bold text-slate-500">{p.progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                                                style={{ width: `${p.progress}%` }}
                                            />
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {Number(p.revenue) > 0 ? (
                                            <div>
                                                <div className="font-bold text-green-600 text-xs">+${Number(p.revenue).toLocaleString()}</div>
                                                <div className="text-[10px] text-slate-400">Profit: ${Number(p.profit).toLocaleString()}</div>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 text-xs">-</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={12} />
                                            {new Date(p.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => onEdit(p.id)} className="p-2 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-lg transition">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-lg transition">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectList;
