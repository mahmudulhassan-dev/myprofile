import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, Link as LinkIcon, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectsManager = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState({
        name: '', description: '', link: '', image: '', tags: [], gallery: []
    });
    const [tagInput, setTagInput] = useState('');

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            setProjects(data);
            setLoading(false);
        } catch (error) { setLoading(false); }
    };

    useEffect(() => { fetchProjects(); }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Saving project...');

        let updatedList;
        if (isEditing && current.id) {
            updatedList = projects.map(p => p.id === current.id ? current : p);
        } else {
            updatedList = [...projects, { ...current, id: Date.now() }];
        }

        try {
            await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedList)
            });
            toast.success('Saved!', { id: toastId });
            fetchProjects();
            resetForm();
        } catch (error) { toast.error('Failed', { id: toastId }); }
    };

    const deleteProject = async (id) => {
        if (!window.confirm('Delete project?')) return;
        const updatedList = projects.filter(p => p.id !== id);
        await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedList)
        });
        setProjects(updatedList);
        toast.success('Deleted');
    };

    const handleImageUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        const toastId = toast.loading('Uploading...');

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();

            if (field === 'gallery') {
                setCurrent(prev => ({ ...prev, gallery: [...(prev.gallery || []), data.path] }));
            } else {
                setCurrent(prev => ({ ...prev, [field]: data.path }));
            }
            toast.success('Uploaded', { id: toastId });
        } catch (error) { toast.error('Failed', { id: toastId }); }
    };

    const addTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!current.tags.includes(tagInput.trim())) {
                setCurrent(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
            }
            setTagInput('');
        }
    };

    const removeTag = (tag) => {
        setCurrent(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrent({ name: '', description: '', link: '', image: '', tags: [], gallery: [] });
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold font-sans">Projects Gallery</h2>
                    <p className="text-slate-500">Manage your portfolio showcase.</p>
                </div>
                <button onClick={resetForm} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition font-medium">Reset Form</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
                        <h3 className="font-bold text-slate-800 mb-6">{isEditing ? 'Edit Project' : 'Add New Project'}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Project Name</label>
                                <input
                                    required
                                    value={current.name}
                                    onChange={e => setCurrent({ ...current, name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500"
                                    placeholder="Awesome App"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Description</label>
                                <textarea
                                    required
                                    value={current.description}
                                    onChange={e => setCurrent({ ...current, description: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 h-24 resize-none"
                                    placeholder="What does it do?"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">External Link</label>
                                <input
                                    value={current.link}
                                    onChange={e => setCurrent({ ...current, link: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500"
                                    placeholder="https://example.com"
                                />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Tags (Press Enter)</label>
                                <input
                                    value={tagInput}
                                    onChange={e => setTagInput(e.target.value)}
                                    onKeyDown={addTag}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500"
                                    placeholder="React, Node..."
                                />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {(current.tags || []).map(tag => (
                                        <span key={tag} className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                            {tag} <X size={12} className="cursor-pointer hover:text-blue-800" onClick={() => removeTag(tag)} />
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Main Image */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Thumbnail</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                        {current.image && <img src={current.image} alt="Thumb" className="w-full h-full object-cover" />}
                                    </div>
                                    <label className="cursor-pointer bg-slate-100 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-200 transition">
                                        Upload <input type="file" hidden onChange={e => handleImageUpload(e, 'image')} />
                                    </label>
                                </div>
                            </div>

                            {/* Gallery */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Gallery Images</label>
                                <div className="grid grid-cols-4 gap-2 mb-2">
                                    {(current.gallery || []).map((img, i) => (
                                        <div key={i} className="relative aspect-square bg-slate-100 rounded overflow-hidden group">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setCurrent(p => ({ ...p, gallery: p.gallery.filter((_, idx) => idx !== i) }))}
                                                className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="cursor-pointer bg-slate-50 border-2 border-dashed border-slate-200 rounded flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition aspect-square">
                                        <Plus size={20} className="text-slate-400" />
                                        <input type="file" hidden onChange={e => handleImageUpload(e, 'gallery')} />
                                    </label>
                                </div>
                            </div>

                            <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2">
                                <Save size={18} /> {isEditing ? 'Update Project' : 'Add Project'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2 grid md:grid-cols-2 gap-6 content-start">
                    {projects.map(project => (
                        <div key={project.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition group">
                            <div className="h-48 bg-slate-100 relative">
                                <img src={project.image || 'https://placehold.co/600x400'} alt={project.name} className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                    <button onClick={() => { setIsEditing(true); setCurrent(project); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-2 bg-white rounded-full shadow text-blue-600 hover:bg-blue-50">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => deleteProject(project.id)} className="p-2 bg-white rounded-full shadow text-red-500 hover:bg-red-50">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-5">
                                <h4 className="font-bold text-slate-800 text-lg mb-1">{project.name}</h4>
                                <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">{project.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {(project.tags || []).slice(0, 3).map(tag => (
                                        <span key={tag} className="text-[10px] bg-slate-100 px-2 py-1 rounded font-bold text-slate-600 uppercase">{tag}</span>
                                    ))}
                                    {(project.tags?.length > 3) && <span className="text-[10px] text-slate-400">+{project.tags.length - 3}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && !loading && (
                        <div className="col-span-2 text-center py-10 text-slate-400">No projects found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectsManager;
