import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, User, Shield, Lock, Search, Filter, Activity, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import RoleManager from './RoleManager';

const UsersManager = () => {
    const [activeTab, setActiveTab] = useState('users'); // users, roles, logs

    // User State
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        username: '', email: '', password: '', roleIds: [], status: 'Active'
    });
    const [showUserModal, setShowUserModal] = useState(false);

    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
            fetchRoles();
        } else if (activeTab === 'logs') {
            fetchLogs();
        }
    }, [activeTab, search, statusFilter, roleFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({ search, status: statusFilter, role: roleFilter });
            const res = await fetch(`/api/admin/users?${query}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setUsers(data.users || []);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load users');
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const res = await fetch('/api/admin/roles', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setRoles(data);
        } catch (error) { console.error('Failed to load roles'); }
    };

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/users/logs', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setLogs(data.logs || []);
            setLoading(false);
        } catch (error) { toast.error('Failed to load logs'); setLoading(false); }
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        const url = isEditing ? `/api/admin/users/${currentUser.id}` : '/api/admin/users';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(currentUser)
            });
            const data = await res.json();

            if (res.ok) {
                toast.success(isEditing ? 'User updated' : 'User created');
                fetchUsers();
                setShowUserModal(false);
                resetForm();
            } else {
                toast.error(data.message || 'Operation failed');
            }
        } catch (error) { toast.error('Server error'); }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Delete this user?')) return;
        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                toast.success('User deleted');
                fetchUsers();
            } else {
                toast.error('Failed to delete');
            }
        } catch (error) { toast.error('Server error'); }
    };

    const openUserModal = (user = null) => {
        if (user) {
            setIsEditing(true);
            setCurrentUser({
                id: user.id,
                username: user.username,
                email: user.email,
                password: '',
                roleIds: user.Roles ? user.Roles.map(r => r.id) : [],
                status: user.status
            });
        } else {
            resetForm();
        }
        setShowUserModal(true);
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentUser({ username: '', email: '', password: '', roleIds: [], status: 'Active' });
    };

    return (
        <div className="space-y-8 animate-fade-in p-2">

            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-sans">User Management</h2>
                    <p className="text-slate-500">Control access, manage users, and configure RBAC roles.</p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'users' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Users
                    </button>
                    <button
                        onClick={() => setActiveTab('roles')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'roles' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Roles & Permissions
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'logs' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Activity Logs
                    </button>
                </div>
            </div>

            {/* Content */}
            {activeTab === 'users' ? (
                <div className="space-y-6">
                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex gap-2 flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    placeholder="Search users..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                                />
                            </div>
                            <select
                                value={roleFilter}
                                onChange={e => setRoleFilter(e.target.value)}
                                className="border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                            >
                                <option value="">All Roles</option>
                                {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                            </select>
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                            >
                                <option value="">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Suspended">Suspended</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>
                        <button onClick={() => openUserModal()} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex items-center gap-2">
                            <Plus size={18} /> Add User
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                                <tr>
                                    <th className="p-4">User</th>
                                    <th className="p-4">Roles</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Joined</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-slate-400">Loading users...</td></tr>
                                ) : users.length === 0 ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-slate-400">No users found</td></tr>
                                ) : (
                                    users.map(user => (
                                        <tr key={user.id} className="hover:bg-slate-50 transition">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 overflow-hidden">
                                                        {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800">{user.username}</p>
                                                        <p className="text-xs text-slate-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-1 flex-wrap">
                                                    {user.Roles && user.Roles.map(role => (
                                                        <span key={role.id} className="px-2 py-0.5 rounded text-[10px] font-bold uppercase border"
                                                            style={{ color: role.color, borderColor: role.color + '40', backgroundColor: role.color + '10' }}>
                                                            {role.name}
                                                        </span>
                                                    ))}
                                                    {(!user.Roles || user.Roles.length === 0) && <span className="text-slate-400 text-xs italic">No Role</span>}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`flex items-center gap-1 text-xs font-bold ${user.status === 'Active' ? 'text-green-600' :
                                                        user.status === 'Suspended' ? 'text-red-500' : 'text-orange-500'
                                                    }`}>
                                                    <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' :
                                                            user.status === 'Suspended' ? 'bg-red-500' : 'bg-orange-500'
                                                        }`}></span>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-500 text-xs">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => openUserModal(user)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => deleteUser(user.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
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
            ) : activeTab === 'roles' ? (
                <RoleManager />
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold flex items-center gap-2">
                            <Activity size={18} className="text-blue-500" /> System Activity Logs
                        </h3>
                        <button onClick={fetchLogs} className="text-sm text-blue-600 font-bold hover:underline">Refresh</button>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Action</th>
                                <th className="p-4">Details</th>
                                <th className="p-4">IP Address</th>
                                <th className="p-4">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading && activeTab === 'logs' ? (
                                <tr><td colSpan="5" className="p-8 text-center text-slate-400">Loading logs...</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-slate-400">No activity logs found</td></tr>
                            ) : (
                                logs.map(log => (
                                    <tr key={log.id} className="hover:bg-slate-50 transition">
                                        <td className="p-4 font-bold text-slate-700">
                                            {log.User ? log.User.username : 'Unknown'}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-mono border">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-600 max-w-xs truncate" title={log.details}>
                                            {log.details}
                                        </td>
                                        <td className="p-4 text-slate-500 text-xs font-mono">
                                            {log.ip_address}
                                        </td>
                                        <td className="p-4 text-slate-400 text-xs whitespace-nowrap">
                                            <div className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {new Date(log.createdAt).toLocaleString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* User Modal */}
            {showUserModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-scale-in">
                        <h3 className="font-bold text-xl mb-6">{isEditing ? 'Edit User' : 'Add New User'}</h3>
                        <form onSubmit={handleUserSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Username</label>
                                <input
                                    value={currentUser.username}
                                    onChange={e => setCurrentUser({ ...currentUser, username: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:border-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={currentUser.email}
                                    onChange={e => setCurrentUser({ ...currentUser, email: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:border-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    Password {isEditing && <span className="font-normal text-slate-400 text-xs">(Leave blank to keep current)</span>}
                                </label>
                                <input
                                    type="password"
                                    value={currentUser.password}
                                    onChange={e => setCurrentUser({ ...currentUser, password: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:border-blue-500 outline-none"
                                    required={!isEditing}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Role (Single for now)</label>
                                    <select
                                        value={currentUser.roleIds[0] || ''}
                                        onChange={e => setCurrentUser({ ...currentUser, roleIds: [e.target.value] })}
                                        className="w-full border border-slate-300 rounded-lg p-2.5 focus:border-blue-500 outline-none"
                                    >
                                        <option value="">Select Role</option>
                                        {roles.map(r => (
                                            <option key={r.id} value={r.id}>{r.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                                    <select
                                        value={currentUser.status}
                                        onChange={e => setCurrentUser({ ...currentUser, status: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg p-2.5 focus:border-blue-500 outline-none"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Suspended">Suspended</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setShowUserModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                                    {isEditing ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersManager;
