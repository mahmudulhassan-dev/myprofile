import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Image as ImageIcon, Calendar, Tag as TagIcon, Folder, Globe, Settings, Eye, MessageSquare, BarChart } from 'lucide-react';
import toast from 'react-hot-toast';
import RichTextEditor from '../../common/RichTextEditor';

const PostEditor = ({ postId, onBack }) => {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('content'); // content, seo, settings, comments

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        status: 'draft',
        categoryId: '',
        tags: '',
        featured_image: '',
        // New Fields
        seo_title: '',
        seo_desc: '',
        seo_keywords: '',
        is_featured: false,
        allow_comments: true,
        priority: 0
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch categories
        fetch('/api/admin/blog/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err));

        // If editing, fetch post
        if (postId) {
            setLoading(true);
            fetch(`/api/admin/blog/posts/${postId}`)
                .then(res => res.json())
                .then(data => {
                    setFormData({
                        ...data,
                        tags: data.Tags ? data.Tags.map(t => t.name).join(', ') : '',
                        is_featured: data.is_featured || false,
                        allow_comments: data.allow_comments !== undefined ? data.allow_comments : true,
                        seo_title: data.seo_title || '',
                        seo_desc: data.seo_desc || '',
                        seo_keywords: data.seo_keywords || ''
                    });
                    setLoading(false);
                })
                .catch(err => {
                    toast.error('Failed to load post');
                    setLoading(false);
                });
        }
    }, [postId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleContentChange = (content) => {
        setFormData(prev => ({ ...prev, content }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
        };

        const url = postId ? `/api/admin/blog/posts/${postId}` : '/api/admin/blog/posts';
        const method = postId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Failed to save');

            toast.success('Post saved successfully');
            if (!postId) onBack(); // Go back on create, stay on update
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Auto-generate SEO if empty
    const generateSEO = () => {
        setFormData(prev => ({
            ...prev,
            slug: prev.slug || prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            seo_title: prev.seo_title || prev.title,
            seo_desc: prev.seo_desc || prev.excerpt || prev.title
        }));
        toast.success('SEO metadata generated from content');
    };

    if (loading && postId) return <div className="p-10 text-center">Loading editor...</div>;

    return (
        <form onSubmit={handleSubmit} className="h-full flex flex-col gap-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button type="button" onClick={onBack} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 text-sm font-medium">
                        <ArrowLeft size={16} /> Back
                    </button>
                    <div className="h-6 w-px bg-slate-200"></div>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setActiveTab('content')} className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 ${activeTab === 'content' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}>
                            <Folder size={16} /> Content
                        </button>
                        <button type="button" onClick={() => setActiveTab('seo')} className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 ${activeTab === 'seo' ? 'bg-purple-50 text-purple-600' : 'text-slate-500 hover:bg-slate-50'}`}>
                            <Globe size={16} /> SEO
                        </button>
                        <button type="button" onClick={() => setActiveTab('settings')} className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 ${activeTab === 'settings' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50'}`}>
                            <Settings size={16} /> Settings
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={`border rounded-lg px-3 py-2 text-sm outline-none font-bold ${formData.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' :
                                formData.status === 'draft' ? 'bg-slate-50 text-slate-700 border-slate-200' : 'bg-red-50 text-red-700 border-red-200'
                            }`}
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </select>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
                    >
                        <Save size={16} /> {loading ? 'Saving...' : 'Save Post'}
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-full">

                {/* --- CONTENT TAB --- */}
                {activeTab === 'content' && (
                    <>
                        <div className="flex-1 space-y-6">
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter Post Title"
                                className="w-full text-4xl font-extrabold placeholder:text-slate-300 border-none outline-none bg-transparent"
                                required
                            />

                            <RichTextEditor
                                value={formData.content}
                                onChange={handleContentChange}
                                placeholder="Write your story here..."
                                height="600px"
                            />

                            <div className="bg-white p-4 rounded-xl border border-slate-200">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Excerpt</label>
                                <textarea
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    placeholder="Brief summary for list views..."
                                    className="w-full h-24 p-3 rounded-lg bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-100 resize-none text-slate-600 text-sm"
                                />
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="w-full lg:w-80 space-y-6">
                            {/* Featured Image */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                                    <ImageIcon size={14} /> Featured Image
                                </label>
                                {formData.featured_image ? (
                                    <div className="relative group">
                                        <img src={formData.featured_image} alt="Cover" className="w-full h-40 object-cover rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, featured_image: '' }))}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <TagIcon size={12} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-slate-200 rounded-lg aspect-video flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer transition gap-2">
                                        <ImageIcon size={24} />
                                        <span className="text-xs font-bold">Upload Cover</span>
                                    </div>
                                )}
                                <input
                                    type="text"
                                    name="featured_image" // Temporary text input for URL
                                    value={formData.featured_image}
                                    onChange={handleChange}
                                    placeholder="Or paste URL..."
                                    className="mt-3 w-full text-xs p-2 border rounded"
                                />
                            </div>

                            {/* Category */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                                    <Folder size={14} /> Category
                                </label>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none font-medium"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Tags */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                                    <TagIcon size={14} /> Tags
                                </label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    placeholder="tech, react, tutorial"
                                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                                />
                                <div className="flex flex-wrap gap-1 mt-3">
                                    {formData.tags.split(',').filter(t => t.trim()).map((t, i) => (
                                        <span key={i} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold">
                                            #{t.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* --- SEO TAB --- */}
                {activeTab === 'seo' && (
                    <div className="max-w-3xl w-full mx-auto space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold">Search Engine Optimization</h3>
                            <button type="button" onClick={generateSEO} className="text-sm text-blue-600 font-bold hover:underline">
                                Auto-Generate from Content
                            </button>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Meta Title</label>
                                <input
                                    name="seo_title"
                                    value={formData.seo_title}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded-lg"
                                    placeholder="Make it catchy (50-60 chars)"
                                    maxLength={60}
                                />
                                <div className="text-xs text-right mt-1 text-slate-400">{formData.seo_title.length}/60</div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Meta Description</label>
                                <textarea
                                    name="seo_desc"
                                    value={formData.seo_desc}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded-lg h-24 resize-none"
                                    placeholder="Summarize the post (150-160 chars)"
                                    maxLength={160}
                                />
                                <div className="text-xs text-right mt-1 text-slate-400">{formData.seo_desc.length}/160</div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Keywords</label>
                                <input
                                    name="seo_keywords"
                                    value={formData.seo_keywords}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded-lg"
                                    placeholder="comma, separated, keywords"
                                />
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <h4 className="font-bold text-slate-500 uppercase text-xs mb-4">Google Search Preview</h4>
                            <div className="font-sans">
                                <div className="text-sm text-slate-800 mb-1 flex items-center gap-1">
                                    <span className="w-4 h-4 rounded-full bg-slate-300 block"></span>
                                    example.com › blog › {formData.slug || 'post-url'}
                                </div>
                                <div className="text-xl text-[#1a0dab] hover:underline cursor-pointer font-medium truncate">
                                    {formData.seo_title || formData.title || 'Post Title'}
                                </div>
                                <div className="text-sm text-slate-600 mt-1 line-clamp-2">
                                    <span className="text-slate-500">{new Date().toLocaleDateString()} — </span>
                                    {formData.seo_desc || formData.excerpt || 'Meta description will appear here...'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- SETTINGS TAB --- */}
                {activeTab === 'settings' && (
                    <div className="max-w-3xl w-full mx-auto space-y-6">
                        <h3 className="text-xl font-bold">Post Settings</h3>

                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <h4 className="font-bold">Featured Post</h4>
                                    <p className="text-xs text-slate-500">Pin to the top of the blog</p>
                                </div>
                                <input
                                    type="checkbox"
                                    name="is_featured"
                                    checked={formData.is_featured}
                                    onChange={handleChange}
                                    className="w-5 h-5 accent-blue-600"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <h4 className="font-bold">Allow Comments</h4>
                                    <p className="text-xs text-slate-500">Users can discuss this post</p>
                                </div>
                                <input
                                    type="checkbox"
                                    name="allow_comments"
                                    checked={formData.allow_comments}
                                    onChange={handleChange}
                                    className="w-5 h-5 accent-blue-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-1">Custom Slug</label>
                                <div className="flex">
                                    <span className="bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg px-3 py-2 text-slate-500 text-sm flex items-center">
                                        /blog/
                                    </span>
                                    <input
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        className="flex-1 border border-slate-300 rounded-r-lg p-2 text-sm font-mono text-blue-600"
                                        placeholder="custom-url-slug"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-1">Priority Order</label>
                                <input
                                    type="number"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-24 border border-slate-300 rounded-lg p-2"
                                />
                                <span className="text-xs text-slate-500 ml-2">Higher number = Lower priority</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </form>
    );
};

export default PostEditor;
