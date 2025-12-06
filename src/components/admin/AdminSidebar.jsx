import React, { useState } from 'react';
import {
    LayoutDashboard, ShoppingBag, FileText, Settings, Image as ImageIcon,
    Users, LogOut, Menu, X, ChevronRight, Bell, Search, Globe, Shield,
    Palette, Share2, Mail, MapPin, Database, Code, BookOpen, MessageSquare, Star,
    DollarSign, HelpCircle, UserCheck, Folder, Briefcase, MessageCircle, Activity
} from 'lucide-react';
import { Link } from 'react-scroll';

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
    return (
        <div className="w-64 bg-slate-900 border-r border-slate-800 h-screen fixed left-0 top-0 flex flex-col z-20 overflow-y-auto">
            {/* Brand */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
                    A
                </div>
                <span className="text-white font-bold text-lg tracking-tight">Admin<span className="text-blue-500">Panel</span></span>
            </div>

            {/* User Mini Profile */}
            <div className="p-4 border-b border-slate-800">
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
                <p className="text-slate-500 text-xs font-bold uppercase mb-3 tracking-wider">Main</p>
                <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                <SidebarItem icon={ShoppingBag} label="Products" active={activeTab === 'products'} onClick={() => setActiveTab('products')} badge="New" />
                <SidebarItem icon={FileText} label="Pages & Blog" active={activeTab === 'blog'} onClick={() => setActiveTab('blog')} />
                <SidebarItem icon={MessageSquare} label="Messages" active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} badge="New" />
                <SidebarItem icon={MessageCircle} label="Live Chat" active={activeTab === 'livechat'} onClick={() => setActiveTab('livechat')} />
                <SidebarItem icon={Activity} label="Pixel Automation" active={activeTab === 'pixels'} onClick={() => setActiveTab('pixels')} />
                <SidebarItem icon={DollarSign} label="Currency" active={activeTab === 'currency'} onClick={() => setActiveTab('currency')} />

                <p className="text-slate-500 text-xs font-bold uppercase mt-6 mb-3 tracking-wider">Content</p>
                <SidebarItem icon={Users} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
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

                <p className="text-slate-500 text-xs font-bold uppercase mt-6 mb-3 tracking-wider">Configuration</p>
                <SidebarItem icon={Settings} label="Global Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
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
