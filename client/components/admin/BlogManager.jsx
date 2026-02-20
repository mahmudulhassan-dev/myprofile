import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FileText, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const BlogManager = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState({
        title: '', excerpt: '', content: '', image: '', status: 'Published', tags: []
    });

    const fetchArticles = async () => {
        try {
            const res = await fetch('/api/articles');
            const data = await res.json();
            setArticles(data);
            setLoading(false);
        } catch (error) { setLoading(false); }
    };

    useEffect(() => { fetchArticles(); }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Saving article...');

        let updatedList;
        if (isEditing && current.id) {
            updatedList = articles.map(a => a.id === current.id ? current : a);
        } else {
            updatedList = [...articles, { ...current, id: Date.now() }];
        }

        try {
            await fetch('/api/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedList)
            });
            toast.success('Published!', { id: toastId });
            fetchArticles();
            resetForm();
        } catch (error) { toast.error('Failed', { id: toastId }); }
    };

    const deleteArticle = async (id) => {
        if (!window.confirm('Delete article?')) return;
        const updatedList = articles.filter(a => a.id !== id);
        await fetch('/api/articles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedList)
        });
        setArticles(updatedList);
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
        setCurrent({ title: '', excerpt: '', content: '', image: '', status: 'Published', tags: [] });
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold font-sans">Blog & News</h2>
                    <p className="text-slate-500">Manage your articles and updates.</p>
                </div>
                <button onClick={resetForm} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition font-medium">New Article</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Editor */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">{isEditing ? 'Edit Article' : 'Write New Article'}</h3>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Title</label>
                            <input
                                required
                                value={current.title}
                                onChange={e => setCurrent({ ...current, title: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 font-bold text-lg"
                                placeholder="Article Headline"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Excerpt (Short Summary)</label>
                            <textarea
                                value={current.excerpt}
                                onChange={e => setCurrent({ ...current, excerpt: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 h-20 resize-none"
                                placeholder="Brief overview..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Content (HTML Supported)</label>
                            <textarea
                                required
                                value={current.content}
                                onChange={e => setCurrent({ ...current, content: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 h-64 font-mono text-sm"
                                placeholder="<p>Write your content here...</p>"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Cover Image</label>
                                <input type="file" onChange={handleImageUpload} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                {current.image && <img src={current.image} alt="Preview" className="h-20 w-auto mt-2 rounded border border-slate-200" />}
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Status</label>
                                <select
                                    value={current.status}
                                    onChange={e => setCurrent({ ...current, status: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none"
                                >
                                    <option value="Published">Published</option>
                                    <option value="Draft">Draft</option>
                                </select>
                            </div>
                        </div>

                        <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition mt-4">
                            {isEditing ? 'Update Article' : 'Publish Article'}
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="space-y-4">
                    {articles.length === 0 && !loading && (
                        <div className="text-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                            <FileText size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No articles yet.</p>
                        </div>
                    )}
                    {articles.map(article => (
                        <div key={article.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex gap-4 hover:shadow-md transition">
                            <div className="w-24 h-24 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
                                {article.image ? <img src={article.image} alt={article.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><FileText /></div>}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-slate-800 line-clamp-1">{article.title}</h4>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${article.status === 'Published' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                        {article.status}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 line-clamp-2 mt-1 mb-2">{article.excerpt}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => { setIsEditing(true); setCurrent(article); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded hover:bg-blue-100">Edit</button>
                                    <button onClick={() => deleteArticle(article.id)} className="px-3 py-1 bg-red-50 text-red-500 text-xs font-bold rounded hover:bg-red-100">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogManager;
