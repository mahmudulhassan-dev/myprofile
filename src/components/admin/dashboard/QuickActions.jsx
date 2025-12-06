import React from 'react';
import { ShoppingBag, FileText, Briefcase, UserPlus, Mail, Settings, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

const QuickAction = ({ icon: Icon, label, color, onClick }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700/80 transition group`}
    >
        <div className={`p-3 rounded-full ${color} bg-opacity-10 mb-2 group-hover:bg-opacity-20`}>
            <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        <span className="text-slate-300 text-sm font-medium">{label}</span>
    </motion.button>
);

const QuickActions = ({ navigate }) => {
    return (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg col-span-1 lg:col-span-3">
            <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <QuickAction icon={ShoppingBag} label="Add Product" color="bg-blue-500" onClick={() => navigate('products')} />
                <QuickAction icon={FileText} label="Write Blog" color="bg-pink-500" onClick={() => navigate('blog')} />
                <QuickAction icon={Briefcase} label="Add Project" color="bg-purple-500" onClick={() => navigate('projects')} />
                <QuickAction icon={UserPlus} label="Add User" color="bg-green-500" onClick={() => navigate('users')} />
                <QuickAction icon={Mail} label="Messages" color="bg-yellow-500" onClick={() => navigate('messages')} />
                <QuickAction icon={Upload} label="Upload File" color="bg-orange-500" onClick={() => navigate('files')} />
                <QuickAction icon={Settings} label="Settings" color="bg-slate-500" onClick={() => navigate('settings')} />
            </div>
        </div>
    );
};

export default QuickActions;
