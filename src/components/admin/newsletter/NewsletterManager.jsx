import React, { useState } from 'react';
import { Layout, Users, Send, BarChart2 } from 'lucide-react';
import SubscriberManager from './SubscriberManager';
import CampaignManager from './CampaignManager';
import AnalyticsDashboard from './AnalyticsDashboard';
import { motion, AnimatePresence } from 'framer-motion';

const NewsletterManager = () => {
    const [view, setView] = useState('subscribers'); // subscribers, campaigns, analytics

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
            <div className="p-4 border-b border-slate-100 flex items-center bg-slate-50/50 rounded-t-2xl gap-4">
                <NavButton target="subscribers" icon={Users} label="Subscribers" />
                <NavButton target="campaigns" icon={Send} label="Campaigns" />
                <NavButton target="analytics" icon={BarChart2} label="Analytics" />
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
                        {view === 'subscribers' && <SubscriberManager />}
                        {view === 'campaigns' && <CampaignManager />}
                        {view === 'analytics' && <AnalyticsDashboard />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default NewsletterManager;
