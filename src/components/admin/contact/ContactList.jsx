import React, { useState, useEffect } from 'react';
import { Mail, Search, CheckCircle, Clock, Trash2, Eye, Filter, RefreshCw, Archive, Download, Paperclip } from 'lucide-react';

const ContactList = ({ onView }) => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        status: 'All',
        search: ''
    });
    const [selected, setSelected] = useState([]);

    const handleSelect = (id) => {
        if (selected.includes(id)) setSelected(prev => prev.filter(i => i !== id));
        else setSelected(prev => [...prev, id]);
    };

    const handleSelectAll = () => {
        if (selected.length === contacts.length) setSelected([]);
        else setSelected(contacts.map(c => c.id));
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selected.length} items?`)) return;
        try {
            await fetch('/api/admin/contacts/bulk-delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ ids: selected })
            });
            setSelected([]);
            fetchContacts();
        } catch (error) {
            console.error(error);
        }
    };

    const handleExport = async () => {
        try {
            const query = new URLSearchParams({ status: filters.status, search: filters.search });
            window.open(`/api/admin/contacts/export?${query}`, '_blank');
        } catch (error) {
            console.error(error);
        }
    };

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                page,
                limit: 10,
                status: filters.status,
                search: filters.search
            });
            const res = await fetch(`/api/admin/contacts?${query}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setContacts(data.contacts || []);
            setTotalPages(data.pages || 1);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [page, filters]);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure?')) return;
        try {
            await fetch(`/api/admin/contacts/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            fetchContacts();
        } catch (error) {
            console.error(error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'replied': return 'bg-green-100 text-green-800';
            case 'archived': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Inbox</h2>
                    <p className="text-slate-500 text-sm">Manage inquiries and project requests</p>
                </div>
                <div className="flex gap-2">
                    {selected.length > 0 && (
                        <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center gap-2">
                            <Trash2 size={18} /> Delete ({selected.length})
                        </button>
                    )}
                    <button onClick={handleExport} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
                        <Download size={18} /> Export
                    </button>
                    <button onClick={fetchContacts} className="p-2 border rounded-lg hover:bg-slate-50 text-slate-600">
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search name, email, subject..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-purple/20"
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                    />
                </div>
                <select
                    className="px-4 py-2 rounded-lg border border-slate-300 bg-white"
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                >
                    <option value="All">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                            <th className="p-4 w-12 text-center">
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={contacts.length > 0 && selected.length === contacts.length}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </th>
                            <th className="p-4 font-semibold">User / Project</th>
                            <th className="p-4 font-semibold">Subject</th>
                            <th className="p-4 font-semibold">Date</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="6" className="p-8 text-center text-slate-500">Loading...</td></tr>
                        ) : contacts.length === 0 ? (
                            <tr><td colSpan="6" className="p-8 text-center text-slate-500">No messages found.</td></tr>
                        ) : (
                            contacts.map(contact => (
                                <tr
                                    key={contact.id}
                                    onClick={() => onView(contact)}
                                    className={`hover:bg-slate-50 transition cursor-pointer group ${selected.includes(contact.id) ? 'bg-blue-50/50' : ''}`}
                                >
                                    <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(contact.id)}
                                            onChange={() => handleSelect(contact.id)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-slate-800">{contact.full_name}</div>
                                        <div className="text-xs text-slate-500">{contact.project_type} • {contact.budget_range}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-slate-800 truncate max-w-xs">{contact.subject}</div>
                                        {contact.attachment && <div className="text-xs text-blue-600 flex items-center gap-1 mt-1"><Paperclip size={12} /> Has Attachment</div>}
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">
                                        {new Date(contact.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(contact.status)}`}>
                                            {contact.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onView(contact); }}
                                                className="p-2 text-slate-400 hover:text-primary-purple hover:bg-purple-50 rounded"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(contact.id, e)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-3 py-1 border rounded hover:bg-slate-50 disabled:opacity-50"
                    >Previous</button>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-3 py-1 border rounded hover:bg-slate-50 disabled:opacity-50"
                    >Next</button>
                </div>
            </div>
        </div>
    );
};

export default ContactList;
