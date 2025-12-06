import React, { useState, useEffect } from 'react';
import { Save, X, Image, DollarSign, Calendar, Globe, Layers, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import RichTextEditor from '../../common/RichTextEditor';

const ProjectEditor = ({ id, onBack }) => {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');

    // Initial State
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        type: 'website',
        status: 'draft',
        progress: 0,
        short_description: '',
        description: '',
        client_name: '',
        client_email: '',
        client_country: '',
        thumbnail: '',
        video_url: '',
        live_url: '',
        github_url: '',
        technologies: [],
        cost: 0,
        expense: 0,
        revenue: 0,
        start_date: '',
        end_date: '',
        deadline: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: ''
    });

    useEffect(() => {
        if (id) fetchProject();
    }, [id]);

    const fetchProject = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/projects/${id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            // Parse JSON fields if necessary (sequelize might send them as objects already)
            setFormData(data);
        } catch (error) { toast.error('Failed to load project'); }
        finally { setLoading(false); }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const url = id ? `/api/projects/${id}` : '/api/projects';
        const method = id ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success('Project saved successfully');
                if (!id) onBack(); // Go back on create
            } else {
                const err = await res.json();
                toast.error(err.error || 'Save failed');
            }
        } catch (error) { toast.error('Save failed'); }
        finally { setLoading(false); }
    };

    const TabButton = ({ id, icon: Icon, label }) => (
        <button
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition ${activeTab === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
        >
            <Icon size={16} /> {label}
        </button>
    );

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 animate-slide-up flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
                <div className="flex items-center gap-3">
                    <button type="button" onClick={onBack} className="p-2 hover:bg-slate-200 rounded-lg transition"><ArrowLeft size={18} /></button>
                    <h3 className="font-bold text-lg text-slate-800">{id ? 'Edit Project' : 'New Project'}</h3>
                </div>
                <div className="flex gap-2">
                    <button type="button" onClick={onBack} className="px-4 py-2 text-slate-500 font-bold text-sm hover:text-slate-800">Cancel</button>
                    <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition flex items-center gap-2">
                        <Save size={16} /> {loading ? 'Saving...' : 'Save Project'}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 flex px-4 overflow-x-auto">
                <TabButton id="basic" icon={Layers} label="Overview" />
                <TabButton id="media" icon={Image} label="Media" />
                <TabButton id="financials" icon={DollarSign} label="Financials" />
                <TabButton id="timeline" icon={Calendar} label="Timeline" />
                <TabButton id="seo" icon={Globe} label="SEO & Tech" />
            </div>

            {/* Body */}
            <div className="p-6 flex-1 overflow-y-auto">
                {activeTab === 'basic' && (
                    <div className="space-y-6 max-w-4xl">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold mb-1">Project Title</label>
                                <input name="title" value={formData.title} onChange={handleChange} className="w-full border p-2 rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Slug</label>
                                <input name="slug" value={formData.slug} onChange={handleChange} className="w-full border p-2 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Type</label>
                                <select name="type" value={formData.type} onChange={handleChange} className="w-full border p-2 rounded-lg">
                                    <option value="website">Website</option>
                                    <option value="app">Mobile App</option>
                                    <option value="brand">Branding</option>
                                    <option value="design">UI/UX Design</option>
                                    <option value="marketing">Marketing</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Status</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2 rounded-lg">
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">Progress ({formData.progress}%)</label>
                            <input type="range" name="progress" min="0" max="100" value={formData.progress} onChange={handleChange} className="w-full" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">Short Description</label>
                            <textarea name="short_description" value={formData.short_description} onChange={handleChange} className="w-full border p-2 rounded-lg h-24" maxLength={300} />
                            <p className="text-xs text-slate-400 text-right">{formData.short_description?.length || 0}/300</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">Full Description</label>
                            <RichTextEditor value={formData.description} onChange={(val) => setFormData(prev => ({ ...prev, description: val }))} height="300px" />
                        </div>

                        <div className="border-t pt-6 mt-6">
                            <h4 className="font-bold text-slate-800 mb-4">Client Information</h4>
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Client Name</label>
                                    <input name="client_name" value={formData.client_name} onChange={handleChange} className="w-full border p-2 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Client Email</label>
                                    <input name="client_email" value={formData.client_email} onChange={handleChange} className="w-full border p-2 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Country</label>
                                    <input name="client_country" value={formData.client_country} onChange={handleChange} className="w-full border p-2 rounded-lg" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'media' && (
                    <div className="space-y-6 max-w-2xl">
                        <div>
                            <label className="block text-sm font-bold mb-1">Thumbnail URL</label>
                            <div className="flex gap-2">
                                <input name="thumbnail" value={formData.thumbnail} onChange={handleChange} className="w-full border p-2 rounded-lg" placeholder="https://..." />
                                <button type="button" className="bg-slate-100 px-4 rounded-lg font-bold text-slate-600">Select</button>
                            </div>
                            {formData.thumbnail && <img src={formData.thumbnail} alt="Preview" className="w-32 h-32 object-cover rounded mt-2 border" />}
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">Project Video URL</label>
                            <input name="video_url" value={formData.video_url} onChange={handleChange} className="w-full border p-2 rounded-lg" placeholder="YouTube/Vimeo link" />
                        </div>

                        <div className="p-8 border-2 border-dashed border-slate-300 rounded-xl text-center text-slate-400">
                            <Image className="mx-auto mb-2 opacity-50" size={32} />
                            <p>Gallery Upload Implementation Pending</p>
                        </div>
                    </div>
                )}

                {activeTab === 'financials' && (
                    <div className="space-y-6 max-w-2xl">
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-bold mb-1">Project Revenue</label>
                                <div className="relative">
                                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="number" name="revenue" value={formData.revenue} onChange={handleChange} className="w-full border p-2 pl-8 rounded-lg outline-none focus:border-green-500 font-bold" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Expenses</label>
                                <div className="relative">
                                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="number" name="expense" value={formData.expense} onChange={handleChange} className="w-full border p-2 pl-8 rounded-lg outline-none focus:border-red-500 font-bold" />
                                </div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl text-center">
                                <label className="block text-xs font-bold mb-1 text-slate-400 uppercase">Net Profit</label>
                                <div className={`text-2xl font-extrabold ${(formData.revenue - formData.expense) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    ${(formData.revenue - formData.expense).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'timeline' && (
                    <div className="space-y-6 max-w-2xl">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold mb-1">Start Date</label>
                                <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full border p-2 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">End Date</label>
                                <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="w-full border p-2 rounded-lg" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Deadline</label>
                            <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full border p-2 rounded-lg" />
                        </div>
                    </div>
                )}

                {activeTab === 'seo' && (
                    <div className="space-y-6 max-w-2xl">
                        <div>
                            <label className="block text-sm font-bold mb-1">Meta Title</label>
                            <input name="meta_title" value={formData.meta_title} onChange={handleChange} className="w-full border p-2 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Meta Description</label>
                            <textarea name="meta_description" value={formData.meta_description} onChange={handleChange} className="w-full border p-2 rounded-lg h-24" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Keywords (Comma separated)</label>
                            <input name="meta_keywords" value={formData.meta_keywords} onChange={handleChange} className="w-full border p-2 rounded-lg" placeholder="design, react, portfolio" />
                        </div>
                        <div className="pt-6 border-t mt-6">
                            <label className="block text-sm font-bold mb-1">Live URL</label>
                            <input name="live_url" value={formData.live_url} onChange={handleChange} className="w-full border p-2 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">GitHub Repo</label>
                            <input name="github_url" value={formData.github_url} onChange={handleChange} className="w-full border p-2 rounded-lg" />
                        </div>
                    </div>
                )}
            </div>
        </form>
    );
};

export default ProjectEditor;
