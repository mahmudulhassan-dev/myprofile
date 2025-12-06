import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Loader2, Bell, Search, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminSidebar from './admin/AdminSidebar';
import SettingsPanel from './admin/SettingsPanel';
import AdvancedDashboard from './admin/AdvancedDashboard';
import FileManager from './admin/FileManager';
import MediaManager from './admin/MediaManager';
import OrdersManager from './admin/OrdersManager';
import PricingManager from './admin/PricingManager';

import ServicesManager from './admin/ServicesManager';
import SkillsManager from './admin/SkillsManager';
import BlogManager from './admin/blog/BlogManager';
import ProductManager from './admin/products/ProductManager';
import TestimonialsManager from './admin/TestimonialsManager';
import FaqManager from './admin/FaqManager';
import ProfileManager from './admin/profile/ProfileManager'; // Updated path

// import ProfileManager from './admin/ProfileManager'; // Old placeholder
import UsersManager from './admin/UsersManager';
import NewsletterManager from './admin/newsletter/NewsletterManager';
import ProjectManager from './admin/projects/ProjectManager';

import SeoManager from './admin/SeoManager';
import ContactManager from './admin/contact/ContactManager';
import ChatInbox from './admin/chat/ChatInbox';
import PixelManager from './admin/pixel/PixelManager';
import CurrencyManager from './admin/currency/CurrencyManager';
import DashboardHome from './admin/dashboard/DashboardHome';
import ContactManager from './admin/contact/ContactManager';

// Placeholder for other sections to keep file clean
const TabPlaceholder = ({ title }) => (
    <div className="flex flex-col items-center justify-center h-96 bg-white rounded-2xl border border-slate-100 border-dashed">
        <h2 className="text-2xl font-bold text-slate-300 mb-2">{title} Manager</h2>
        <p className="text-slate-400">This module is under construction.</p>
    </div>
);

const AdminDashboard = () => {
    const { t } = useLanguage();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(false);

    // Simple password protection 
    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'admin123') {
            setIsAuthenticated(true);
        } else {
            toast.error('Invalid Password');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
                <form onSubmit={handleLogin} className="bg-white/10 backdrop-blur-xl p-10 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl relative z-10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-600 rounded-xl mx-auto flex items-center justify-center mb-4 text-white text-2xl font-bold font-mono">
                            A
                        </div>
                        <h2 className="text-2xl font-bold text-white">Admin Access</h2>
                        <p className="text-slate-400 text-sm mt-1">Enter your secure key to continue</p>
                    </div>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-600 rounded-xl p-4 mb-6 text-white focus:border-blue-500 outline-none text-center tracking-widest text-lg placeholder:text-slate-600"
                        placeholder="••••••••"
                    />
                    <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-4 rounded-xl text-white font-bold transition shadow-lg shadow-blue-600/30">
                        Unlock Dashboard
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex">
            {/* Sidebar */}
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content */}
            <div className="ml-64 flex-1 flex flex-col min-h-screen">

                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 px-8 flex items-center justify-between shadow-sm">
                    <h1 className="text-xl font-bold text-slate-800 capitalize flex items-center gap-2">
                        {activeTab} <span className="text-slate-300 font-light">/</span> <span className="text-sm font-medium text-slate-500">Overview</span>
                    </h1>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-slate-100 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-100 outline-none w-64"
                            />
                        </div>
                        <div className="relative">
                            <Bell className="text-slate-500 hover:text-blue-600 cursor-pointer transition" size={20} />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </div>
                        <a href="/" target="_blank" className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition">
                            View Site <ExternalLink size={14} />
                        </a>
                    </div>
                </header>

                {/* Content Body */}
                <main className="p-8 flex-1 overflow-y-auto">
                    {activeTab === 'dashboard' && <AdvancedDashboard />}
                    {activeTab === 'settings' && <SettingsPanel />}

                    {activeTab === 'profile' && <ProfileManager />}

                    {/* Catalog */}
                    {activeTab === 'projects' && <ProjectManager />}
                    {activeTab === 'services' && <ServicesManager />}
                    {activeTab === 'products' && <TabPlaceholder title="Products" />}

                    {/* Content */}
                    {activeTab === 'skills' && <SkillsManager />}
                    {activeTab === 'blog' && <BlogManager />}
                    {activeTab === 'testimonials' && <TestimonialsManager />}
                    {activeTab === 'pages' && <TabPlaceholder title="Pages" />}
                    {activeTab === 'files' && <FileManager />}
                    {activeTab === 'media' && <MediaManager />}
                    {activeTab === 'products' && <ProductManager />}

                    {/* Users & Marketing */}
                    {activeTab === 'users' && <UsersManager />}
                    {activeTab === 'newsletter' && <NewsletterManager />}
                    {activeTab === 'orders' && <OrdersManager />}
                    {activeTab === 'pricing' && <PricingManager />}
                    {activeTab === 'faq' && <FaqManager />}
                    {activeTab === 'seo' && <SeoManager />}
                    {activeTab === 'messages' && <ContactManager />}
                    {activeTab === 'livechat' && <ChatInbox />}
                    {activeTab === 'pixels' && <PixelManager />}
                    {activeTab === 'currency' && <CurrencyManager />}


                    {activeTab === 'pages' && <TabPlaceholder title="Pages" />}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
