import React, { useState } from 'react';
import { LayoutDashboard, List, Plus } from 'lucide-react';
import ProjectDashboard from './ProjectDashboard';
import ProjectList from './ProjectList';
import ProjectEditor from './ProjectEditor';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectManager = () => {
    const [view, setView] = useState('dashboard'); // dashboard, list, editor
    const [editId, setEditId] = useState(null);

    const handleEdit = (id) => {
        setEditId(id);
        setView('editor');
    };

    const handleCreate = () => {
        setEditId(null);
        setView('editor');
    };

    const handleBackInfo = () => {
        setView('list');
        setEditId(null);
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
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
                <div className="flex gap-4">
                    <NavButton target="dashboard" icon={LayoutDashboard} label="Overview" />
                    <NavButton target="list" icon={List} label="All Projects" />
                </div>
                {view !== 'editor' && (
                    <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-blue-700 transition flex items-center gap-2">
                        <Plus size={16} /> New Project
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={view}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="h-full"
                    >
                        {view === 'dashboard' && <ProjectDashboard onCreate={handleCreate} />}
                        {view === 'list' && <ProjectList onEdit={handleEdit} />}
                        {view === 'editor' && <ProjectEditor id={editId} onBack={handleBackInfo} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ProjectManager;
