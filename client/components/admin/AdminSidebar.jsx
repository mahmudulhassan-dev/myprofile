import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
    LayoutDashboard, ShoppingBag, FileText, Settings, Image as ImageIcon,
    Users, LogOut, Menu, X, ChevronRight, Bell, Search, Globe, Shield,
    Palette, Share2, Mail, MapPin, Database, Code, BookOpen, MessageSquare, Star,
    DollarSign, HelpCircle, UserCheck, Folder, Briefcase, MessageCircle, Activity,
    Layout, Columns, BarChart2, Layers, Tag, Box, Package, TrendingUp
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick, badge }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-3 rounded-lg mb-1 transition-all duration-200 group ${active
            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
    >
        <div className="flex items-center gap-3">
            <Icon size={20} className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
            <span className="font-medium text-sm">{label}</span>
        </div>
        {badge && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {badge}
            </span>
        )}
    </button>
);

const AdminSidebar = ({ activeTab, setActiveTab }) => {
    const { t } = useLanguage();
    return (
        <div className="w-64 bg-slate-900 border-r border-slate-800 h-screen fixed left-0 top-0 flex flex-col z-20 overflow-y-auto">
            {/* Brand */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
                    A
                </div>
                <span className="text-white font-bold text-lg tracking-tight">Admin<span className="text-blue-500">Panel</span></span>
            </div>

            {/* User Mini Profile - Clickable to go to Profile */}
            <div
                className={`p-4 border-b border-slate-800 cursor-pointer transition-colors ${activeTab === 'profile' ? 'bg-slate-800' : 'hover:bg-slate-800/50'}`}
                onClick={() => setActiveTab('profile')}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden border-2 border-slate-600">
                        <img src="/profile.jpg" alt="Admin" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-white text-sm font-semibold">M. Hassan</p>
                        <p className="text-slate-400 text-xs">Super Admin</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="p-4 flex-1">
                <p className="text-slate-500 text-xs font-bold uppercase mb-3 tracking-wider">{t('admin_dashboard')}</p>
                <SidebarItem icon={LayoutDashboard} label={t('admin_dashboard')} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />

                {/* MH Commerce Section */}
                <p className="text-blue-400 text-xs font-bold uppercase mt-6 mb-3 tracking-wider flex items-center gap-2">
                    <ShoppingBag size={12} /> MH Commerce `Pro`
                </p>
                <div className="space-y-0.5 mb-6 border-l border-slate-800 ml-1 pl-2">
                    <SidebarItem icon={BarChart2} label="Dashboard" active={activeTab === 'mh-dashboard'} onClick={() => setActiveTab('mh-dashboard')} />
                    <SidebarItem icon={Layers} label="Categories" active={activeTab === 'mh-categories'} onClick={() => setActiveTab('mh-categories')} />
                    <SidebarItem icon={Tag} label="Attributes" active={activeTab === 'mh-attributes'} onClick={() => setActiveTab('mh-attributes')} />
                    <SidebarItem icon={Box} label="Products" active={activeTab === 'mh-products'} onClick={() => setActiveTab('mh-products')} badge="Core" />
                    <SidebarItem icon={Package} label="Stock Manager" active={activeTab === 'mh-stock'} onClick={() => setActiveTab('mh-stock')} />
                    <SidebarItem icon={MessageSquare} label="Reviews" active={activeTab === 'mh-reviews'} onClick={() => setActiveTab('mh-reviews')} />
                    <SidebarItem icon={TrendingUp} label="Analytics" active={activeTab === 'mh-analytics'} onClick={() => setActiveTab('mh-analytics')} />
                    <SidebarItem icon={Settings} label="Settings" active={activeTab === 'mh-settings'} onClick={() => setActiveTab('mh-settings')} />
                </div>

                <p className="text-slate-500 text-xs font-bold uppercase mt-6 mb-3 tracking-wider">Content</p>
                <SidebarItem icon={FileText} label="Pages & Blog" active={activeTab === 'blog'} onClick={() => setActiveTab('blog')} />
                <SidebarItem icon={Folder} label="File Manager" active={activeTab === 'files'} onClick={() => setActiveTab('files')} />
                <SidebarItem icon={Database} label="Services" active={activeTab === 'services'} onClick={() => setActiveTab('services')} />
                <SidebarItem icon={Shield} label="Skills" active={activeTab === 'skills'} onClick={() => setActiveTab('skills')} />
                <SidebarItem icon={Briefcase} label="Projects" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
                <SidebarItem icon={Star} label="Testimonials" active={activeTab === 'testimonials'} onClick={() => setActiveTab('testimonials')} />
                <SidebarItem icon={DollarSign} label="Pricing Plans" active={activeTab === 'pricing'} onClick={() => setActiveTab('pricing')} />
                <SidebarItem icon={HelpCircle} label="FAQs" active={activeTab === 'faq'} onClick={() => setActiveTab('faq')} />

                <p className="text-slate-500 text-xs font-bold uppercase mt-6 mb-3 tracking-wider">Growth & Users</p>
                <SidebarItem icon={UserCheck} label="User Management" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                <SidebarItem icon={Mail} label="Newsletter" active={activeTab === 'newsletter'} onClick={() => setActiveTab('newsletter')} />
                <SidebarItem icon={Search} label="SEO & Metadata" active={activeTab === 'seo'} onClick={() => setActiveTab('seo')} />
                <SidebarItem icon={MessageCircle} label="Live Chat" active={activeTab === 'livechat'} onClick={() => setActiveTab('livechat')} />

                <p className="text-slate-500 text-xs font-bold uppercase mt-6 mb-3 tracking-wider">Configuration</p>
                <SidebarItem icon={Settings} label={t('admin_settings')} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                <SidebarItem icon={Palette} label={t('admin_appearance')} active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')} badge="Pro" />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800">
                <button className="flex items-center gap-2 text-red-400 hover:text-red-300 transition text-sm font-medium w-full p-2 rounded hover:bg-red-500/10">
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
