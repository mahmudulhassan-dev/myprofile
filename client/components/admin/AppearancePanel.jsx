import React, { useState, useEffect } from 'react';
import {
    Palette, Image, Layout, Box, MousePointer, FileText, Grid, Share2,
    Globe, DollarSign, Moon, Smartphone, Zap, Search, Code, Download, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

// Module Imports
import GlobalTheme from './appearance/GlobalTheme';
import LogoBranding from './appearance/LogoBranding';
import HeaderBuilder from './appearance/HeaderBuilder';
import FooterBuilder from './appearance/FooterBuilder';
import HomepageBuilder from './appearance/HomepageBuilder';
import PageBuilder from './appearance/PageBuilder'; // Pending
import WidgetManager from './appearance/WidgetManager';
import SocialSettings from './appearance/SocialSettings';
import Localization from './appearance/Localization'; // Pending
import CurrencySettings from './appearance/CurrencySettings'; // Pending
import DarkMode from './appearance/DarkMode'; // Pending
import ResponsiveControls from './appearance/ResponsiveControls'; // Pending
import AnimationSettings from './appearance/AnimationSettings'; // Pending
import SEOSettings from './appearance/SEOSettings'; // Pending
import CustomCode from './appearance/CustomCode'; // Pending
import ImportExport from './appearance/ImportExport'; // Pending
import PreviewMode from './appearance/PreviewMode'; // Pending

const AppearancePanel = () => {
    const [activeSection, setActiveSection] = useState('theme');
    const [loading, setLoading] = useState(false);

    // Menu Structure
    const menuItems = [
        { id: 'theme', label: 'Global Theme', icon: Palette, desc: 'Colors, Typography, Spacing' },
        { id: 'branding', label: 'Logo & Branding', icon: Image, desc: 'Logos, Favicon, Brand Info' },
        { id: 'header', label: 'Header Builder', icon: Layout, desc: 'Menu, Layout, Sticky' },
        { id: 'footer', label: 'Footer Builder', icon: Box, desc: 'Widgets, Copyright, Layout' },
        { id: 'homepage', label: 'Homepage Builder', icon: MousePointer, desc: 'Drag & Drop Selection' },
        { id: 'pages', label: 'Page Builder', icon: FileText, desc: 'Custom Pages & Templates' },
        { id: 'widgets', label: 'Widget Manager', icon: Grid, desc: 'Sidebar & Footer Widgets' },
        { id: 'social', label: 'Social Media', icon: Share2, desc: 'Links, Icons, Position' },
        { id: 'localization', label: 'Language', icon: Globe, desc: 'Translations & RTL' },
        { id: 'currency', label: 'Currency', icon: DollarSign, desc: 'Multi-currency Toggle' },
        { id: 'darkmode', label: 'Dark Mode', icon: Moon, desc: 'Dark Theme Customization' },
        { id: 'responsive', label: 'Responsive', icon: Smartphone, desc: 'Mobile & Tablet View' },
        { id: 'animation', label: 'Animations', icon: Zap, desc: 'Motion & Effects' },
        { id: 'seo', label: 'SEO Appearance', icon: Search, desc: 'Meta & Schema Defaults' },
        { id: 'code', label: 'Custom Code', icon: Code, desc: 'CSS/JS Injection' },
        { id: 'import', label: 'Import / Export', icon: Download, desc: 'Backup & Restore Theme' },
        { id: 'preview', label: 'Live Preview', icon: Eye, desc: 'View Changes Real-time' },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'theme': return <GlobalTheme />;
            case 'branding': return <LogoBranding />;
            case 'header': return <HeaderBuilder />;
            case 'footer': return <FooterBuilder />;
            case 'homepage': return <HomepageBuilder />;
            case 'pages': return <PageBuilder />;
            case 'widgets': return <WidgetManager />;
            case 'social': return <SocialSettings />;
            case 'localization': return <Localization />;
            case 'currency': return <CurrencySettings />;
            case 'darkmode': return <DarkMode />;
            case 'responsive': return <ResponsiveControls />;
            case 'animation': return <AnimationSettings />;
            case 'seo': return <SEOSettings />;
            case 'code': return <CustomCode />;
            case 'import': return <ImportExport />;
            case 'preview': return <PreviewMode />;
            default: return <div className="p-10 text-center text-slate-500">Module Coming Soon</div>;
        }
    };

    return (
        <div className="flex h-[calc(100vh-100px)] bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-100">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                        <Palette size={20} className="text-blue-600" />
                        Appearance
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Customize entire website</p>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors ${activeSection === item.id
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <item.icon size={18} />
                            <div>
                                <div className="text-sm">{item.label}</div>
                                <div className="text-[10px] text-slate-400 leading-none mt-0.5">{item.desc}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
                {/* Header */}
                <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
                    <h3 className="font-bold text-slate-800">{menuItems.find(m => m.id === activeSection)?.label}</h3>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-2">
                            <Eye size={16} /> Preview
                        </button>
                        <button className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/20">
                            <Download size={16} /> Save Changes
                        </button>
                    </div>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AppearancePanel;
