import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Code } from 'lucide-react';

const ScriptManager = () => {
    const [scripts, setScripts] = useState([]);
    const [showForm, setShowForm] = useState(false);

    // Form
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [placement, setPlacement] = useState('header');

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchScripts();
    }, []);

    const fetchScripts = async () => {
        const res = await fetch('/api/pixel/admin/scripts', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setScripts(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/pixel/admin/scripts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name, script_content: content, placement, is_active: true })
        });
        if (res.ok) {
            toast.success('Script Added');
            setShowForm(false);
            fetchScripts();
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete script?')) return;
        await fetch(`/api/pixel/admin/scripts/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchScripts();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Custom Scripts</h3>
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg">
                    <Plus size={16} /> Add Script
                </button>
            </div>

            {showForm && (
                <div className="mb-6 p-4 border rounded-lg bg-slate-50">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" placeholder="Script Name" required />
                        <select value={placement} onChange={e => setPlacement(e.target.value)} className="w-full p-2 border rounded">
                            <option value="header">Header (&lt;head&gt;)</option>
                            <option value="footer">Footer (&lt;/body&gt;)</option>
                        </select>
                        <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full p-2 border rounded font-mono text-xs h-32" placeholder="<script>...</script>" required />
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Script</button>
                    </form>
                </div>
            )}

            <div className="grid gap-4">
                {scripts.map(s => (
                    <div key={s.id} className="bg-white border rounded-lg p-4 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Code size={16} className="text-blue-500" />
                                <h4 className="font-bold">{s.name}</h4>
                                <span className="bg-slate-100 text-xs px-2 py-0.5 rounded uppercase">{s.placement}</span>
                            </div>
                            <pre className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded max-w-lg overflow-x-auto">
                                {s.script_content.substring(0, 100)}...
                            </pre>
                        </div>
                        <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScriptManager;
