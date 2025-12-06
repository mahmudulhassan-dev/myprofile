import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Eye, Calendar, User, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const PostList = ({ onEdit }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/admin/blog/posts');
            const data = await res.json();
            setPosts(data.posts || []); // Adjust based on API response structure
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load posts');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await fetch(`/api/admin/blog/posts/${id}`, { method: 'DELETE' });
            toast.success('Post deleted');
            fetchPosts();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    if (loading) return <div className="text-center p-10 text-slate-400">Loading posts...</div>;

    return (
        <div>
            {posts.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500 mb-2">No posts found</p>
                    <p className="text-sm text-slate-400">Create your first blog post to get started.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 tracking-wider">
                                <th className="p-4 font-semibold">Title</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Author</th>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {posts.map(post => (
                                <tr key={post.id} className="hover:bg-slate-50 transition">
                                    <td className="p-4">
                                        <div className="font-medium text-slate-800">{post.title}</div>
                                        <div className="text-xs text-slate-400 mt-1 truncate max-w-xs">{post.slug}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.status === 'published' ? 'bg-green-100 text-green-700' :
                                                post.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-slate-100 text-slate-600'
                                            }`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">Admin</td> {/* Placeholder for Author */}
                                    <td className="p-4 text-sm text-slate-500">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button
                                            onClick={() => onEdit(post.id)}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PostList;
