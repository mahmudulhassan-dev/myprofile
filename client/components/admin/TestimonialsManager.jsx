import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MessageCircle, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const TestimonialsManager = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState({ name: '', role: '', company: '', message: '', image: '', rating: 5 });

    const fetchTestimonials = async () => {
        try {
            const res = await fetch('/api/testimonials');
            const data = await res.json();
            setTestimonials(data);
            setLoading(false);
        } catch (error) { setLoading(false); }
    };

    useEffect(() => { fetchTestimonials(); }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        let updatedList;
        if (isEditing && current.id) {
            updatedList = testimonials.map(t => t.id === current.id ? current : t);
        } else {
            updatedList = [...testimonials, { ...current, id: Date.now() }];
        }

        try {
            await fetch('/api/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedList)
            });
            toast.success('Saved');
            fetchTestimonials();
            resetForm();
        } catch (e) { toast.error('Failed'); }
    };

    const deleteTestimonial = async (id) => {
        if (!window.confirm('Delete?')) return;
        const updatedList = testimonials.filter(t => t.id !== id);
        await fetch('/api/testimonials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedList)
        });
        setTestimonials(updatedList);
        toast.success('Deleted');
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            setCurrent(prev => ({ ...prev, image: data.path }));
            toast.success('Image uploaded');
        } catch (error) { toast.error('Upload failed'); }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrent({ name: '', role: '', company: '', message: '', image: '', rating: 5 });
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold font-sans">Testimonials & Reviews</h2>
                    <p className="text-slate-500">Manage client feedback.</p>
                </div>
                <button onClick={resetForm} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition font-medium">Add Review</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
                        <h3 className="font-bold text-slate-800 mb-6">{isEditing ? 'Edit Review' : 'Add New Review'}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Client Name</label>
                                <input
                                    required
                                    value={current.name}
                                    onChange={e => setCurrent({ ...current, name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Role</label>
                                    <input
                                        value={current.role}
                                        onChange={e => setCurrent({ ...current, role: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500"
                                        placeholder="CEO"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Company</label>
                                    <input
                                        value={current.company}
                                        onChange={e => setCurrent({ ...current, company: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500"
                                        placeholder="Tech Corp"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Review Message</label>
                                <textarea
                                    required
                                    value={current.message}
                                    onChange={e => setCurrent({ ...current, message: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 h-24 resize-none"
                                    placeholder="Great service..."
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Rating</label>
                                    <select
                                        value={current.rating}
                                        onChange={e => setCurrent({ ...current, rating: parseInt(e.target.value) })}
                                        className="w-full bg-slate-50 p-3 rounded-lg border border-slate-200"
                                    >
                                        <option value="5">5 Stars</option>
                                        <option value="4">4 Stars</option>
                                        <option value="3">3 Stars</option>
                                        <option value="2">2 Stars</option>
                                        <option value="1">1 Star</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Photo</label>
                                    <input type="file" onChange={handleImageUpload} className="w-full text-xs" />
                                </div>
                            </div>
                            {current.image && <img src={current.image} className="w-12 h-12 rounded-full object-cover border-2 border-slate-200" />}

                            <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition mt-2">
                                {isEditing ? 'Update Review' : 'Add Review'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="md:col-span-2 grid md:grid-cols-2 gap-4 content-start">
                    {testimonials.length === 0 && !loading && <div className="col-span-2 text-center py-10 text-slate-400">No testimonials yet.</div>}
                    {testimonials.map(t => (
                        <div key={t.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <img src={t.image || 'https://placehold.co/100x100?text=U'} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-slate-100" />
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm">{t.name}</h4>
                                        <p className="text-xs text-slate-500">{t.role} @ {t.company}</p>
                                    </div>
                                </div>
                                <div className="flex text-yellow-500">
                                    {[...Array(t.rating || 5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 italic mb-4">"{t.message}"</p>
                            <div className="flex gap-2 justify-end">
                                <button onClick={() => { setIsEditing(true); setCurrent(t); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded bg-slate-50">
                                    <Edit2 size={14} />
                                </button>
                                <button onClick={() => deleteTestimonial(t.id)} className="p-2 text-red-500 hover:bg-red-50 rounded bg-slate-50">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestimonialsManager;
