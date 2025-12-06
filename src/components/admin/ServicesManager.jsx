import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Code, Smartphone, Globe, Server, Database, Cloud, Zap, Shield, Search, CheckCircle, Smartphone as Mobile } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import toast from 'react-hot-toast';

const ServicesManager = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentService, setCurrentService] = useState({ title: '', description: '', icon: 'Code' });

    // Fetch Services
    const fetchServices = async () => {
        try {
            const res = await fetch('/api/services');
            const data = await res.json();
            setServices(data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load services');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // Save Service (Create/Update)
    const handleSave = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Saving service...');

        // Optimistic Update / Logic
        // Our backend generic handler accepts a LIST to BULK REPLACE (simplistic implementation).
        // So we need to modify the local list and send the ENTIRE list back.
        // This is not ideal for concurrency but fine for a personal portfolio.

        let updatedServices;
        if (isEditing && currentService.id) {
            updatedServices = services.map(s => s.id === currentService.id ? currentService : s);
        } else {
            updatedServices = [...services, { ...currentService, id: Date.now() }]; // Temp ID
        }

        try {
            // NOTE: The generic endpoint /api/services accepts an ARRAY and replaces the table.
            // Ensure backend supports this. We checked server/index.js line 96, it does.
            const res = await fetch('/api/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedServices)
            });

            if (res.ok) {
                toast.success('Service saved!', { id: toastId });
                fetchServices(); // Refresh to get real IDs
                resetForm();
            } else {
                toast.error('Failed to save', { id: toastId });
            }
        } catch (error) {
            toast.error('Network error', { id: toastId });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;

        const updatedServices = services.filter(s => s.id !== id);
        try {
            await fetch('/api/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedServices)
            });
            toast.success('Service deleted');
            setServices(updatedServices);
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentService({ title: '', description: '', icon: 'Code' });
    };

    const startEdit = (service) => {
        setIsEditing(true);
        setCurrentService(service);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Icon Preview
    const renderIcon = (iconName) => {
        const Icon = LucideIcons[iconName] || LucideIcons.HelpCircle;
        return <Icon size={24} />;
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold font-sans">Services</h2>
                    <p className="text-slate-500">Manage the services you offer.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={resetForm} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition font-medium">Clear Form</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
                        <h3 className="font-bold text-slate-800 mb-6">{isEditing ? 'Edit Service' : 'Add New Service'}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Service Title</label>
                                <input
                                    required
                                    value={currentService.title}
                                    onChange={e => setCurrentService({ ...currentService, title: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500"
                                    placeholder="e.g. Web Development"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Description</label>
                                <textarea
                                    required
                                    value={currentService.description}
                                    onChange={e => setCurrentService({ ...currentService, description: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 h-32 resize-none"
                                    placeholder="Brief details about the service..."
                                />
                            </div>
                            <div>
                                <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Icon Name (Lucide React)</label>
                                <div className="flex gap-2">
                                    <input
                                        required
                                        value={currentService.icon}
                                        onChange={e => setCurrentService({ ...currentService, icon: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500"
                                        placeholder="e.g. Code, Database, Smartphone"
                                    />
                                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-blue-600">
                                        {renderIcon(currentService.icon)}
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">Use valid Lucide Icon names (Case Sensitive).</p>
                            </div>

                            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition shadow-lg mt-2">
                                {isEditing ? 'Update Service' : 'Add Service'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="md:col-span-2 space-y-4">
                    {loading ? (
                        <div className="text-center py-20 text-slate-400">Loading services...</div>
                    ) : services.length === 0 ? (
                        <div className="text-center py-20 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <Code size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No services added yet.</p>
                        </div>
                    ) : (
                        services.map((service) => (
                            <div key={service.id || Math.random()} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 group hover:shadow-md transition">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    {renderIcon(service.icon)}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800 text-lg">{service.title}</h4>
                                    <p className="text-slate-500 text-sm mt-1 mb-4 leading-relaxed">{service.description}</p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => startEdit(service)}
                                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-bold flex items-center gap-1 transition"
                                        >
                                            <Edit2 size={12} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded text-xs font-bold flex items-center gap-1 transition"
                                        >
                                            <Trash2 size={12} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServicesManager;
