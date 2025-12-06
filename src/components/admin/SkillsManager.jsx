import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Hash } from 'lucide-react';
import toast from 'react-hot-toast';

const SkillsManager = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState({ title: '', level: 50, category: 'Frontend', color: '#3b82f6' });

    const categories = ['Frontend', 'Backend', 'Tools', 'Design', 'Other'];
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];

    const fetchSkills = async () => {
        try {
            const res = await fetch('/api/skills');
            const data = await res.json();
            setSkills(data);
            setLoading(false);
        } catch (error) { setLoading(false); }
    };

    useEffect(() => { fetchSkills(); }, []);

    const handleSave = async (e) => {
        e.preventDefault();

        let updatedList;
        if (isEditing && current.id) {
            updatedList = skills.map(s => s.id === current.id ? current : s);
        } else {
            updatedList = [...skills, { ...current, id: Date.now() }];
        }

        try {
            await fetch('/api/skills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedList)
            });
            toast.success('Saved');
            fetchSkills();
            resetForm();
        } catch (e) { toast.error('Failed'); }
    };

    const deleteSkill = async (id) => {
        if (!window.confirm('Delete?')) return;
        const updatedList = skills.filter(s => s.id !== id);
        await fetch('/api/skills', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedList)
        });
        setSkills(updatedList);
        toast.success('Deleted');
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrent({ title: '', level: 50, category: 'Frontend', color: '#3b82f6' });
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold font-sans">Skills & Expertise</h2>
                    <p className="text-slate-500">Manage your technical skills.</p>
                </div>
                <button onClick={resetForm} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition font-medium">Reset Form</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
                        <h3 className="font-bold text-slate-800 mb-6">{isEditing ? 'Edit Skill' : 'Add New Skill'}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Skill Name</label>
                                <input
                                    required
                                    value={current.title}
                                    onChange={e => setCurrent({ ...current, title: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500"
                                    placeholder="e.g. React.js"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Category</label>
                                <select
                                    value={current.category || 'Frontend'}
                                    onChange={e => setCurrent({ ...current, category: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500"
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Proficiency ({current.level}%)</label>
                                <input
                                    type="range"
                                    min="0" max="100"
                                    value={current.level}
                                    onChange={e => setCurrent({ ...current, level: parseInt(e.target.value) })}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Accent Color</label>
                                <div className="flex gap-2">
                                    {colors.map(c => (
                                        <button
                                            type="button"
                                            key={c}
                                            onClick={() => setCurrent({ ...current, color: c })}
                                            className={`w-8 h-8 rounded-full border-2 transition ${current.color === c ? 'border-slate-800 scale-110' : 'border-transparent'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                    <input
                                        type="color"
                                        value={current.color}
                                        onChange={e => setCurrent({ ...current, color: e.target.value })}
                                        className="w-8 h-8 rounded-full overflow-hidden border-0 p-0"
                                    />
                                </div>
                            </div>

                            <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition mt-2">
                                {isEditing ? 'Update Skill' : 'Add Skill'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List grouped by Category */}
                <div className="lg:col-span-2 space-y-6">
                    {categories.map(cat => {
                        const catSkills = skills.filter(s => (s.category || 'Frontend') === cat);
                        if (catSkills.length === 0) return null;

                        return (
                            <div key={cat} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 font-bold text-slate-700 uppercase text-xs tracking-wider">
                                    {cat}
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {catSkills.map(skill => (
                                        <div key={skill.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition group">
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shrink-0" style={{ backgroundColor: skill.color }}>
                                                {skill.title.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <h4 className="font-bold text-slate-800">{skill.title}</h4>
                                                    <span className="text-xs font-bold text-slate-500">{skill.level}%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                    <div className="h-full rounded-full" style={{ width: `${skill.level}%`, backgroundColor: skill.color }}></div>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                                <button onClick={() => { setIsEditing(true); setCurrent(skill); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => deleteSkill(skill.id)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                    {skills.length === 0 && !loading && <div className="text-center py-10 text-slate-400">No skills added.</div>}
                </div>
            </div>
        </div>
    );
};

export default SkillsManager;
