import React, { useState, useEffect } from 'react';
import {
    Save, Globe, Palette, Share2, Mail, CreditCard, HardDrive, Database,
    RefreshCw, LayoutGrid, CheckCircle, Shield, Languages,
    Bell, LayoutDashboard, DollarSign, Sparkles, Image, Type, Layout
} from 'lucide-react';
import toast from 'react-hot-toast';

// Import all settings components
import GeneralSettings from './settings/GeneralSettings';
import BrandingSettings from './settings/BrandingSettings';
import SeoSettings from './settings/SeoSettings';
import SocialSettings from './settings/SocialSettings';
import ContactSettings from './settings/ContactSettings';
import PaymentSettings from './settings/PaymentSettings';
import StorageSettings from './settings/StorageSettings';
import SystemSettings from './settings/SystemSettings';
import TrackingSettings from './settings/TrackingSettings';
import ThemeSettings from './settings/ThemeSettings';
import LayoutSettings from './settings/LayoutSettings';
import TypographySettings from './settings/TypographySettings';
import LanguageSettings from './settings/LanguageSettings';
import NotificationSettings from './settings/NotificationSettings';
import DashboardSettings from './settings/DashboardSettings';
import SecuritySettings from './settings/SecuritySettings';
import CurrencySettings from './settings/CurrencySettings';
import ExperienceSettings from './settings/ExperienceSettings';
import BackupSettings from './settings/BackupSettings';
import MediaSettings from './settings/MediaSettings';

const SettingsPanel = () => {
    const [activeSection, setActiveSection] = useState('general');
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = () => {
        setLoading(true);
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                setSettings(data);
                setLoading(false);
            })
            .catch(() => {
                toast.error('Failed to load settings');
                setLoading(false);
            });
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        const toastId = toast.loading('Uploading...');
        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                handleChange(key, data.url);
                toast.success('Uploaded successfully', { id: toastId });
            }
        } catch (error) {
            toast.error('Upload failed', { id: toastId });
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        const toastId = toast.loading('Saving configuration...');
        try {
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            toast.success('Settings saved successfully', { id: toastId });
            setIsSaving(false);
        } catch (error) {
            toast.error('Failed to save settings', { id: toastId });
            setIsSaving(false);
        }
    };

    // Organized menu structure with categories
    const menuCategories = [
        {
            title: 'Appearance',
            items: [
                { id: 'theme', icon: Palette, label: 'Theme & Colors' },
                { id: 'layout', icon: LayoutGrid, label: 'Layout Controls' },
                { id: 'typography', icon: Type, label: 'Typography' },
                { id: 'branding', icon: Image, label: 'Branding & Logo' },
            ]
        },
        {
            title: 'Content & Data',
            items: [
                { id: 'general', icon: Globe, label: 'General & Identity' },
                { id: 'seo', icon: CheckCircle, label: 'SEO & Meta' },
                { id: 'social', icon: Share2, label: 'Social Media' },
                { id: 'language', icon: Languages, label: 'Language & Locale' },
            ]
        },
        {
            title: 'Business',
            items: [
                { id: 'currency', icon: DollarSign, label: 'Currency & Rates' },
                { id: 'payment', icon: CreditCard, label: 'Payment & API' },
                { id: 'contact', icon: Mail, label: 'Contact & SMTP' },
            ]
        },
        {
            title: 'System',
            items: [
                { id: 'security', icon: Shield, label: 'Security & Login' },
                { id: 'notification', icon: Bell, label: 'Notifications' },
                { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard Settings' },
                { id: 'experience', icon: Sparkles, label: 'UX & Experience' },
            ]
        },
        {
            title: 'Technical',
            items: [
                { id: 'media', icon: Image, label: 'Media & Storage' },
                { id: 'storage', icon: HardDrive, label: 'Storage & CDN' },
                { id: 'tracking', icon: CheckCircle, label: 'Pixel & Tracking' },
                { id: 'backup', icon: Database, label: 'Backup & Restore' },
                { id: 'system', icon: HardDrive, label: 'System Status' },
            ]
        },
    ];

    if (loading) return (
        <div className="flex h-96 items-center justify-center text-slate-500">
            <RefreshCw className="animate-spin mr-2" /> Loading System...
        </div>
    );

    const renderContent = () => {
        const props = { settings, handleChange, handleFileUpload };

        switch (activeSection) {
            case 'general': return <GeneralSettings {...props} />;
            case 'branding': return <BrandingSettings {...props} />;
            case 'seo': return <SeoSettings {...props} />;
            case 'tracking': return <TrackingSettings {...props} />;
            case 'social': return <SocialSettings {...props} />;
            case 'contact': return <ContactSettings {...props} />;
            case 'payment': return <PaymentSettings {...props} />;
            case 'storage': return <StorageSettings {...props} />;
            case 'system': return <SystemSettings {...props} />;
            case 'theme': return <ThemeSettings {...props} />;
            case 'layout': return <LayoutSettings {...props} />;
            case 'typography': return <TypographySettings {...props} />;
            case 'language': return <LanguageSettings {...props} />;
            case 'notification': return <NotificationSettings {...props} />;
            case 'dashboard': return <DashboardSettings {...props} />;
            case 'security': return <SecuritySettings {...props} />;
            case 'currency': return <CurrencySettings {...props} />;
            case 'experience': return <ExperienceSettings {...props} />;
            case 'backup': return <BackupSettings {...props} />;
            case 'media': return <MediaSettings {...props} />;
            default: return <GeneralSettings {...props} />;
        }
    };

    return (
        <div className="animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <LayoutGrid size={24} className="text-blue-600" /> Global Settings
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Manage all 20+ configuration modules for your entire application.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchSettings} className="p-3 text-slate-500 hover:bg-slate-100 rounded-xl transition tooltip" title="Refresh">
                        <RefreshCw size={20} />
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-500/20 font-bold disabled:opacity-70"
                    >
                        {isSaving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Sidebar */}
                <div className="col-span-12 lg:col-span-3">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 sticky top-24 overflow-hidden max-h-[calc(100vh-150px)] overflow-y-auto">
                        <div className="p-3 space-y-4">
                            {menuCategories.map((category, catIdx) => (
                                <div key={catIdx}>
                                    <p className="text-xs font-bold text-slate-400 uppercase px-3 mb-2">{category.title}</p>
                                    <div className="space-y-1">
                                        {category.items.map(item => (
                                            <button
                                                key={item.id}
                                                onClick={() => setActiveSection(item.id)}
                                                className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeSection === item.id
                                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                                                    : 'text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <item.icon size={18} className={activeSection === item.id ? 'text-white' : 'text-slate-400'} />
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="col-span-12 lg:col-span-9">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;
