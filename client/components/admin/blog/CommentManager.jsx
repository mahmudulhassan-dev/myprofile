import React, { useState, useEffect } from 'react';
import { MessageSquare, Check, X, Trash2, Reply, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const CommentManager = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, approved
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');

    useEffect(() => {
        fetchComments();
    }, [filter]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const query = filter !== 'all' ? `?status=${filter}` : '';
            const res = await fetch(`/api/comments${query}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setComments(data.comments || []);
        } catch (error) {
            toast.error('Failed to load comments');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => { // approve, reject
        try {
            await fetch(`/api/comments/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: action })
            });
            toast.success(`Comment ${action}d`);
            fetchComments();
        } catch (error) { toast.error('Action failed'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this comment?')) return;
        try {
            await fetch(`/api/comments/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success('Comment deleted');
            fetchComments();
        } catch (error) { toast.error('Delete failed'); }
    };

    const handleReply = async (parentId, postId) => {
        if (!replyContent.trim()) return;
        try {
            await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Auth as Admin
                },
                body: JSON.stringify({
                    postId,
                    parentId,
                    content: replyContent,
                    userId: 1, // Placeholder: In real app, get from Context
                    name: 'Admin', // Placeholder
                    email: 'admin@example.com'
                })
            });
            toast.success('Reply posted');
            setReplyingTo(null);
            setReplyContent('');
            fetchComments();
        } catch (error) { toast.error('Reply failed'); }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <MessageSquare className="text-blue-600" /> Comments Moderation
                </h2>
                <div className="flex gap-2 bg-white p-1 rounded-lg border border-slate-200">
                    <button onClick={() => setFilter('all')} className={`px-3 py-1 text-xs font-bold rounded ${filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>All</button>
                    <button onClick={() => setFilter('pending')} className={`px-3 py-1 text-xs font-bold rounded ${filter === 'pending' ? 'bg-orange-500 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Pending</button>
                    <button onClick={() => setFilter('approved')} className={`px-3 py-1 text-xs font-bold rounded ${filter === 'approved' ? 'bg-green-500 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Approved</button>
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center p-10 text-slate-400">Loading comments...</div>
                ) : comments.length === 0 ? (
                    <div className="text-center p-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <MessageSquare className="mx-auto text-slate-300 mb-2" size={32} />
                        <p className="text-slate-500 font-medium">No comments found</p>
                    </div>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className={`bg-white p-5 rounded-xl border shadow-sm transition ${comment.is_approved ? 'border-slate-200' : 'border-orange-200 bg-orange-50/30'}`}>
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 uppercase">
                                        {comment.name?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{comment.name}</h4>
                                        <p className="text-xs text-slate-500">{comment.email}</p>
                                    </div>
                                    {!comment.is_approved && (
                                        <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Pending Approval</span>
                                    )}
                                </div>
                                <div className="text-xs text-slate-400">
                                    {new Date(comment.createdAt).toLocaleString()} on
                                    <span className="font-bold ml-1 text-blue-600">{comment.BlogPost?.title}</span>
                                </div>
                            </div>

                            <p className="text-slate-600 text-sm mb-4 leading-relaxed pl-13 ml-12 border-l-2 border-slate-100 pl-4">{comment.content}</p>

                            <div className="flex justify-end gap-2 ml-12">
                                {!comment.is_approved ? (
                                    <>
                                        <button onClick={() => handleAction(comment.id, 'approve')} className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-bold hover:bg-green-100">
                                            <Check size={14} /> Approve
                                        </button>
                                        <button onClick={() => handleAction(comment.id, 'reject')} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100">
                                            <X size={14} /> Reject
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => handleAction(comment.id, 'reject')} className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-100">
                                        <X size={14} /> Unapprove
                                    </button>
                                )}
                                <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100">
                                    <Reply size={14} /> Reply
                                </button>
                                <button onClick={() => handleDelete(comment.id)} className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 text-slate-400 rounded-lg text-xs font-bold hover:bg-red-50 hover:text-red-500">
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>

                            {/* Reply Box */}
                            {replyingTo === comment.id && (
                                <div className="ml-12 mt-3 bg-slate-50 p-3 rounded-lg border border-slate-200 animate-fade-in">
                                    <textarea
                                        className="w-full p-2 border rounded-md text-sm mb-2"
                                        rows="2"
                                        placeholder="Write a reply..."
                                        value={replyContent}
                                        onChange={e => setReplyContent(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => setReplyingTo(null)} className="text-xs text-slate-500 hover:underline">Cancel</button>
                                        <button onClick={() => handleReply(comment.id, comment.BlogPostId)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold">Post Reply</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentManager;
