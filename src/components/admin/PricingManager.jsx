import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const PricingManager = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState({ name: '', price: '', period: 'Monthly', features: [], button_text: 'Get Started', is_featured: false });
    const [featureInput, setFeatureInput] = useState('');

    const fetchPlans = async () => {
        try {
            const res = await fetch('/api/pricing');
            const data = await res.json();
            setPlans(data);
            setLoading(false);
        } catch (error) { setLoading(false); }
    };

    useEffect(() => { fetchPlans(); }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        const updatedList = isEditing && current.id
            ? plans.map(p => p.id === current.id ? current : p)
            : [...plans, { ...current, id: Date.now() }];

        try {
            await fetch('/api/pricing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedList)
            });
            toast.success('Saved');
            fetchPlans();
            resetForm();
        } catch (e) { toast.error('Failed'); }
    };

    const deletePlan = async (id) => {
        if (!window.confirm('Delete plan?')) return;
        const updatedList = plans.filter(p => p.id !== id);
        await fetch('/api/pricing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedList)
        });
        setPlans(updatedList);
        toast.success('Deleted');
    };

    const addFeature = (e) => {
        if (e.key === 'Enter' && featureInput.trim()) {
            e.preventDefault();
            setCurrent(prev => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
            setFeatureInput('');
        }
    };

    const removeFeature = (index) => {
        setCurrent(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrent({ name: '', price: '', period: 'Monthly', features: [], button_text: 'Get Started', is_featured: false });
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold font-sans">Pricing Plans</h2>
                    <p className="text-slate-500">Manage service packages.</p>
                </div>
                <button onClick={resetForm} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition font-medium">Add Plan</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
                        <h3 className="font-bold text-slate-800 mb-6">{isEditing ? 'Edit Plan' : 'Add New Plan'}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Plan Name</label>
                                <input
                                    required
                                    value={current.name}
                                    onChange={e => setCurrent({ ...current, name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 font-bold"
                                    placeholder="Basic"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Price</label>
                                    <input
                                        value={current.price}
                                        onChange={e => setCurrent({ ...current, price: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500"
                                        placeholder="$99"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Period</label>
                                    <select
                                        value={current.period}
                                        onChange={e => setCurrent({ ...current, period: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none"
                                    >
                                        <option>Monthly</option>
                                        <option>Yearly</option>
                                        <option>One-Time</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Features (Press Enter)</label>
                                <input
                                    value={featureInput}
                                    onChange={e => setFeatureInput(e.target.value)}
                                    onKeyDown={addFeature}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500"
                                    placeholder="Add feature..."
                                />
                                <div className="space-y-2 mt-3">
                                    {(current.features || []).map((feat, i) => (
                                        <div key={i} className="flex justify-between items-center bg-green-50 text-green-700 px-3 py-2 rounded text-sm">
                                            <span className="flex items-center gap-2"><Check size={14} /> {feat}</span>
                                            <X size={14} className="cursor-pointer hover:text-green-900" onClick={() => removeFeature(i)} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={current.is_featured}
                                    onChange={e => setCurrent({ ...current, is_featured: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                <label className="text-sm text-slate-600 font-bold">Recommended Plan (Highlight)</label>
                            </div>

                            <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition mt-2">
                                {isEditing ? 'Update Plan' : 'Create Plan'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2 grid md:grid-cols-2 gap-6 content-start">
                    {plans.map(plan => (
                        <div key={plan.id} className={`bg-white rounded-xl border ${plan.is_featured ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200'} shadow-sm p-6 relative`}>
                            {plan.is_featured && <span className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">Recommended</span>}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-xl">{plan.name}</h4>
                                    <p className="text-slate-500 text-sm">{plan.period}</p>
                                </div>
                                <div className="text-2xl font-bold text-slate-800">{plan.price}</div>
                            </div>
                            <div className="space-y-3 mb-6">
                                {(plan.features || []).map((feat, i) => (
                                    <p key={i} className="text-sm text-slate-600 flex items-center gap-2">
                                        <Check size={16} className="text-green-500" /> {feat}
                                    </p>
                                ))}
                            </div>
                            <div className="flex gap-2 border-t border-slate-100 pt-4">
                                <button onClick={() => { setIsEditing(true); setCurrent(plan); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex-1 py-2 bg-slate-50 text-slate-600 font-bold rounded-lg hover:bg-slate-100 text-sm">Edit</button>
                                <button onClick={() => deletePlan(plan.id)} className="py-2 px-3 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PricingManager;
