import React, { useState, useEffect } from 'react';
import { Shield, Plus, Edit2, Trash2, Check, X, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const RoleManager = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState({});
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentRole, setCurrentRole] = useState({ name: '', slug: '', description: '', color: '#4f46e5', permissionIds: [] });
    const [showModal, setShowModal] = useState(false);

    const fetchRoles = async () => {
        try {
            const res = await fetch('/api/admin/roles', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setRoles(data);
        } catch (error) { toast.error('Failed to load roles'); }
    };

    const fetchPermissions = async () => {
        try {
            const res = await fetch('/api/admin/roles/permissions', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setPermissions(data.grouped);
            setLoading(false);
        } catch (error) { toast.error('Failed to load permissions'); }
    };

    useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEditing ? `/api/admin/roles/${currentRole.id}` : '/api/admin/roles';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(currentRole)
            });
            const data = await res.json();

            if (res.ok) {
                toast.success(isEditing ? 'Role updated' : 'Role created');
                fetchRoles();
                setShowModal(false);
            } else {
                toast.error(data.message || 'Operation failed');
            }
        } catch (error) { toast.error('Server error'); }
    };

    const deleteRole = async (id) => {
        if (!window.confirm('Delete this role?')) return;
        try {
            const res = await fetch(`/api/admin/roles/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                toast.success('Role deleted');
                fetchRoles();
            } else {
                const data = await res.json();
                toast.error(data.message);
            }
        } catch (error) { toast.error('Failed to delete'); }
    };

    const togglePermission = (permId) => {
        const ids = currentRole.permissionIds || [];
        if (ids.includes(permId)) {
            setCurrentRole({ ...currentRole, permissionIds: ids.filter(id => id !== permId) });
        } else {
            setCurrentRole({ ...currentRole, permissionIds: [...ids, permId] });
        }
    };

    const openModal = (role = null) => {
        if (role) {
            setIsEditing(true);
            setCurrentRole({
                ...role,
                permissionIds: role.Permissions ? role.Permissions.map(p => p.id) : []
            });
        } else {
            setIsEditing(false);
            setCurrentRole({ name: '', slug: '', description: '', color: '#4f46e5', permissionIds: [] });
        }
        setShowModal(true);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Roles & Permissions</h3>
                <button onClick={() => openModal()} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
                    <Plus size={18} /> New Role
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map(role => (
                    <div key={role.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative group overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: role.color }}></div>
                        <div className="flex justify-between items-start mb-3 pl-2">
                            <div>
                                <h4 className="font-bold text-lg">{role.name}</h4>
                                <span className="text-xs text-slate-500 uppercase font-mono">{role.slug}</span>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                <button onClick={() => openModal(role)} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-blue-600">
                                    <Edit2 size={16} />
                                </button>
                                {!role.is_system && (
                                    <button onClick={() => deleteRole(role.id)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded text-red-600">
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-4 pl-2 min-h-[40px]">{role.description}</p>

                        <div className="pl-2">
                            <h5 className="text-xs font-bold uppercase text-slate-400 mb-2 flex items-center gap-1">
                                <Shield size={12} /> {(role.Permissions || []).length} Permissions
                            </h5>
                            <div className="flex flex-wrap gap-1">
                                {role.Permissions && role.Permissions.slice(0, 5).map(p => (
                                    <span key={p.id} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded border border-slate-200">
                                        {p.name}
                                    </span>
                                ))}
                                {role.Permissions && role.Permissions.length > 5 && (
                                    <span className="px-1.5 py-0.5 bg-slate-50 text-slate-400 text-[10px] rounded">
                                        +{role.Permissions.length - 5}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-xl">{isEditing ? 'Edit Role' : 'Create Role'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Role Name</label>
                                    <input
                                        value={currentRole.name}
                                        onChange={e => setCurrentRole({ ...currentRole, name: e.target.value })}
                                        className="w-full border p-2 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Slug (ID)</label>
                                    <input
                                        value={currentRole.slug}
                                        onChange={e => setCurrentRole({ ...currentRole, slug: e.target.value })}
                                        className="w-full border p-2 rounded bg-slate-50"
                                        disabled={isEditing && currentRole.is_system}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold mb-1">Description</label>
                                    <textarea
                                        value={currentRole.description}
                                        onChange={e => setCurrentRole({ ...currentRole, description: e.target.value })}
                                        className="w-full border p-2 rounded"
                                        rows="2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Badge Color</label>
                                    <input
                                        type="color"
                                        value={currentRole.color}
                                        onChange={e => setCurrentRole({ ...currentRole, color: e.target.value })}
                                        className="w-full h-10 border p-1 rounded cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h4 className="font-bold mb-4 flex items-center gap-2">
                                    <Lock size={18} /> Permissions
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Object.entries(permissions).map(([module, perms]) => (
                                        <div key={module} className="border rounded-lg p-4 bg-slate-50">
                                            <h5 className="font-bold capitalize mb-3 text-slate-700 bg-white p-2 rounded shadow-sm inline-block">
                                                {module}
                                            </h5>
                                            <div className="space-y-2">
                                                {perms.map(perm => (
                                                    <label key={perm.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-1 rounded">
                                                        <input
                                                            type="checkbox"
                                                            checked={currentRole.permissionIds?.includes(perm.id)}
                                                            onChange={() => togglePermission(perm.id)}
                                                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span className="text-sm">{perm.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg">Cancel</button>
                            <button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                                {isEditing ? 'Update Role' : 'Create Role'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoleManager;
