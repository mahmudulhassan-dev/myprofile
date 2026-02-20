import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, Zap } from 'lucide-react';

const EventManager = () => {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [triggerType, setTriggerType] = useState('page_view');
    const [triggerValue, setTriggerValue] = useState('');
    const [actions, setActions] = useState('[]');

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/pixel/admin/events', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setEvents(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name,
                trigger_type: triggerType,
                trigger_value: triggerValue,
                actions: JSON.parse(actions),
                is_active: true
            };

            const res = await fetch('/api/pixel/admin/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success('Event Created');
                setShowForm(false);
                fetchEvents();
            }
        } catch (error) {
            toast.error('Invalid JSON in Actions');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this event?')) return;
        await fetch(`/api/pixel/admin/events/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchEvents();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Automation Rules</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus size={16} /> New Rule
                </button>
            </div>

            {showForm && (
                <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-1">Rule Name</label>
                            <input value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" placeholder="e.g. Leads from Contact Form" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Trigger Type</label>
                                <select value={triggerType} onChange={e => setTriggerType(e.target.value)} className="w-full p-2 border rounded">
                                    <option value="page_view">Page View</option>
                                    <option value="click">Button Click</option>
                                    <option value="form_submit">Form Submit</option>
                                    <option value="custom">Custom Event</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Trigger Value (URL / ID)</label>
                                <input value={triggerValue} onChange={e => setTriggerValue(e.target.value)} className="w-full p-2 border rounded" placeholder="/contact or #submit-btn" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Actions JSON</label>
                            <textarea
                                value={actions}
                                onChange={e => setActions(e.target.value)}
                                className="w-full p-2 border rounded font-mono text-xs h-24"
                                placeholder='[{"platform": "facebook", "event": "Lead"}]'
                            />
                            <p className="text-xs text-slate-500 mt-1">Format: <code>[{`{"platform": "facebook", "event": "Lead"}`}]</code></p>
                        </div>
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Create Rule</button>
                    </form>
                </div>
            )}

            <div className="space-y-2">
                {events.map(event => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-lg shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="bg-purple-100 p-2 rounded text-purple-600"><Zap size={20} /></div>
                            <div>
                                <h4 className="font-bold text-slate-800">{event.name}</h4>
                                <p className="text-sm text-slate-500">
                                    When <b>{event.trigger_type}</b> matches <code>{event.trigger_value}</code>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                                {Array.isArray(event.actions) ? event.actions.length : 0} Actions
                            </span>
                            <button onClick={() => handleDelete(event.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventManager;
