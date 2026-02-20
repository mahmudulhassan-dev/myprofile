import React, { useState } from 'react';
import { Layout, FileText, Plus, Tags, MessageSquare, BarChart2, Folder } from 'lucide-react';
import PostList from './PostList';
import PostEditor from './PostEditor';
import CategoryManager from './CategoryManager';
import TagManager from './TagManager';
import CommentManager from './CommentManager';
import BlogAnalytics from './BlogAnalytics';
import { motion, AnimatePresence } from 'framer-motion';

const BlogManager = () => {
    const [view, setView] = useState('list'); // list, editor, categories, tags, comments, analytics
    const [editingPostId, setEditingPostId] = useState(null);

    const handleEdit = (id) => {
        setEditingPostId(id);
        setView('editor');
    };

    const handleCreate = () => {
        setEditingPostId(null);
        setView('editor');
    };

    const handleBack = () => {
        setView('list');
        setEditingPostId(null);
    };

    const NavButton = ({ target, icon: Icon, label }) => (
        <button
            onClick={() => setView(target)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${view === target ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
        >
            <Icon size={16} /> {label}
        </button>
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[calc(100vh-8rem)] flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center bg-slate-50/50 rounded-t-2xl gap-4">
                <div className="flex items-center gap-1 overflow-x-auto w-full pb-2 md:pb-0">
                    <NavButton target="list" icon={FileText} label="Posts" />
                    <NavButton target="categories" icon={Folder} label="Categories" />
                    <NavButton target="tags" icon={Tags} label="Tags" />
                    <NavButton target="comments" icon={MessageSquare} label="Comments" />
                    <NavButton target="analytics" icon={BarChart2} label="Analytics" />
                </div>

                {view === 'list' && (
                    <button
                        onClick={handleCreate}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition shadow-lg shadow-blue-600/20 whitespace-nowrap"
                    >
                        <Plus size={16} /> New Post
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={view}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                    >
                        {view === 'list' && <PostList onEdit={handleEdit} />}
                        {view === 'editor' && <PostEditor postId={editingPostId} onBack={handleBack} />}
                        {view === 'categories' && <CategoryManager />}
                        {view === 'tags' && <TagManager />}
                        {view === 'comments' && <CommentManager />}
                        {view === 'analytics' && <BlogAnalytics />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default BlogManager;
