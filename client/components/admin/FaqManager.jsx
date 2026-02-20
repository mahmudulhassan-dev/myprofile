import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const FaqManager = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState({ question: '', answer: '', category: 'General' });

    const fetchFaqs = async () => {
        try {
            const res = await fetch('/api/faqs');
            const data = await res.json();
            setFaqs(data);
            setLoading(false);
        } catch (error) { setLoading(false); }
    };

    useEffect(() => { fetchFaqs(); }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        const updatedList = isEditing && current.id
            ? faqs.map(f => f.id === current.id ? current : f)
            : [...faqs, { ...current, id: Date.now() }];

        try {
            await fetch('/api/faqs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedList)
            });
            toast.success('Saved');
            fetchFaqs();
            resetForm();
        } catch (e) { toast.error('Failed'); }
    };

    const deleteFaq = async (id) => {
        if (!window.confirm('Delete FAQ?')) return;
        const updatedList = faqs.filter(f => f.id !== id);
        await fetch('/api/faqs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedList)
        });
        setFaqs(updatedList);
        toast.success('Deleted');
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrent({ question: '', answer: '', category: 'General' });
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold font-sans">FAQ Management</h2>
                    <p className="text-slate-500">Frequently Asked Questions.</p>
                </div>
                <button onClick={resetForm} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition font-medium">Add FAQ</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
                        <h3 className="font-bold text-slate-800 mb-6">{isEditing ? 'Edit FAQ' : 'Add New FAQ'}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Question</label>
                                <input
                                    required
                                    value={current.question}
                                    onChange={e => setCurrent({ ...current, question: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500"
                                    placeholder="How do I...?"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Category</label>
                                <input
                                    value={current.category}
                                    onChange={e => setCurrent({ ...current, category: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500"
                                    placeholder="General, Payment, Support"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Answer</label>
                                <textarea
                                    required
                                    value={current.answer}
                                    onChange={e => setCurrent({ ...current, answer: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 h-32 resize-none"
                                    placeholder="The answer is..."
                                />
                            </div>
                            <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition mt-2">
                                {isEditing ? 'Update FAQ' : 'Create FAQ'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="md:col-span-2 space-y-4">
                    {faqs.map(faq => (
                        <div key={faq.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-slate-800 text-lg">{faq.question}</h4>
                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase font-bold">{faq.category}</span>
                            </div>
                            <p className="text-slate-500 text-sm mb-4 leading-relaxed">{faq.answer}</p>
                            <div className="flex gap-2 justify-end">
                                <button onClick={() => { setIsEditing(true); setCurrent(faq); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-blue-600 text-xs font-bold hover:underline">Edit</button>
                                <button onClick={() => deleteFaq(faq.id)} className="text-red-500 text-xs font-bold hover:underline">Delete</button>
                            </div>
                        </div>
                    ))}
                    {faqs.length === 0 && !loading && <div className="text-center py-10 text-slate-400">No FAQs added.</div>}
                </div>
            </div>
        </div>
    );
};

export default FaqManager;
