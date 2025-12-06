import React, { useState, useEffect } from 'react';
import { Save, Globe, Palette, Share2, Mail, MapPin, Database, Code, Shield, Lock, Download, AlertTriangle, CreditCard, Bot, Key } from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPanel = () => {
    const [activeSection, setActiveSection] = useState(0);
    const [settings, setSettings] = useState({
        site_title: '',
        tagline: '',
        site_description: '',
        primary_color: '#8B5CF6',
        secondary_color: '#EC4899',
        background_theme: 'Aurora (Light)',
        maintenance_mode: false,
        contact_email: '',
        contact_phone: '',
        contact_address: '',
        social_facebook: '',
        social_linkedin: '',
        social_github: '',
        social_github: '',
        custom_css: '',
        admin_password: '', // Only for updates
        google_client_id: '',
        google_client_secret: '',
        facebook_app_id: '',
        facebook_app_secret: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                setSettings(prev => ({ ...prev, ...data }));
                setLoading(false);
            })
            .catch(() => toast.error('Failed to load settings'));
    }, []);

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        const toastId = toast.loading('Saving settings...');
        try {
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            toast.success('Settings saved successfully', { id: toastId });
        } catch (error) {
            toast.error('Failed to save settings', { id: toastId });
        }
    };

    const handleBackup = () => {
        window.open('http://localhost:5000/api/backup', '_blank');
    };

    const menuItems = [
        { icon: Globe, label: 'General Info' },
        { icon: Palette, label: 'Appearance' },
        { icon: Shield, label: 'Security' },
        { icon: Share2, label: 'Social Media' },
        { icon: Mail, label: 'Contact Info' },
        { icon: CreditCard, label: 'Payment Methods' },
        { icon: Bot, label: 'AI Configuration' },
        { icon: Key, label: 'Social Login / Auth' }, // New
        { icon: Code, label: 'Custom Code' },
        { icon: Database, label: 'System & Backup' },
    ];

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Configuration...</div>;

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Global Settings</h2>
                    <p className="text-slate-500">Manage your website configuration from one place.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 font-medium"
                >
                    <Save size={18} /> Save Changes
                </button>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Settings Menu */}
                <div className="col-span-12 md:col-span-3 space-y-2">
                    {menuItems.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveSection(i)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition ${activeSection === i ? 'bg-white text-blue-600 shadow-sm border border-slate-100 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <item.icon size={18} /> {item.label}
                        </button>
                    ))}
                </div>

                {/* Settings Content */}
                <div className="col-span-12 md:col-span-9 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">

                    {activeSection === 0 && (
                        <div className="animate-fade-in">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">General Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Site Title</label>
                                    <input
                                        value={settings.site_title}
                                        onChange={(e) => handleChange('site_title', e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Tagline</label>
                                    <input
                                        value={settings.tagline}
                                        onChange={(e) => handleChange('tagline', e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Site Description (SEO)</label>
                                <textarea
                                    value={settings.site_description}
                                    onChange={(e) => handleChange('site_description', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none h-24"
                                />
                            </div>
                        </div>
                    )}

                    {activeSection === 1 && (
                        <div className="animate-fade-in">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Appearance</h3>
                            <div className="grid grid-cols-3 gap-6 mb-8">
                                <div>
                                    <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Primary Color</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={settings.primary_color}
                                            onChange={(e) => handleChange('primary_color', e.target.value)}
                                            className="h-10 w-10 rounded border-0 cursor-pointer"
                                        />
                                        <span className="text-slate-500 text-xs font-mono">{settings.primary_color}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Secondary Color</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={settings.secondary_color}
                                            onChange={(e) => handleChange('secondary_color', e.target.value)}
                                            className="h-10 w-10 rounded border-0 cursor-pointer"
                                        />
                                        <span className="text-slate-500 text-xs font-mono">{settings.secondary_color}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Background Theme</label>
                                    <select
                                        value={settings.background_theme}
                                        onChange={(e) => handleChange('background_theme', e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700"
                                    >
                                        <option>Aurora (Light)</option>
                                        <option>Midnight (Dark)</option>
                                        <option>Minimal (White)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 2 && (
                        <div className="animate-fade-in">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Security & Access</h3>

                            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 flex items-start gap-3 mb-8">
                                <AlertTriangle className="text-yellow-600 mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <h4 className="text-yellow-800 font-bold text-sm">Maintenance Mode</h4>
                                    <p className="text-yellow-700 text-xs mt-1">Activate this to hide your site from public view. Only admins can access.</p>
                                </div>
                                <div className="ml-auto">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.maintenance_mode}
                                            onChange={(e) => handleChange('maintenance_mode', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Change Admin Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter new password to change"
                                    value={settings.admin_password}
                                    onChange={(e) => handleChange('admin_password', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none"
                                />
                                <p className="text-xs text-slate-400 mt-2">Leave blank to keep current password.</p>
                            </div>
                        </div>
                    )}

                    {activeSection === 3 && (
                        <div className="animate-fade-in">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Social Media</h3>
                            <div className="space-y-4">
                                {['facebook', 'linkedin', 'github', 'twitter', 'instagram', 'youtube'].map(platform => (
                                    <div key={platform}>
                                        <label className="block text-slate-500 text-xs font-bold uppercase mb-2">{platform} URL</label>
                                        <input
                                            value={settings[`social_${platform}`] || ''}
                                            onChange={(e) => handleChange(`social_${platform}`, e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none"
                                            placeholder={`https://${platform}.com/username`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSection === 4 && (
                        <div className="animate-fade-in">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Contact Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Support Email</label>
                                    <input
                                        value={settings.contact_email}
                                        onChange={(e) => handleChange('contact_email', e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Phone Number</label>
                                    <input
                                        value={settings.contact_phone}
                                        onChange={(e) => handleChange('contact_phone', e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Physical Address</label>
                                    <textarea
                                        value={settings.contact_address}
                                        onChange={(e) => handleChange('contact_address', e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none h-24"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 7 && (
                        <div className="animate-fade-in">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Social Login Integration</h3>
                            <p className="text-sm text-slate-500 mb-6">Configure OAuth credentials to allow users to sign in with Google and Facebook.</p>

                            {/* Google */}
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
                                <h4 className="flex items-center gap-2 font-bold text-slate-700 mb-4">
                                    <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">G</span>
                                    Google Configuration
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Google Client ID</label>
                                        <input
                                            value={settings.google_client_id || ''}
                                            onChange={(e) => handleChange('google_client_id', e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none"
                                            placeholder="xyz...apps.googleusercontent.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Google Client Secret</label>
                                        <input
                                            type="password"
                                            value={settings.google_client_secret || ''}
                                            onChange={(e) => handleChange('google_client_secret', e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none"
                                            placeholder="GOCSPX-..."
                                        />
                                    </div>
                                    <div className="bg-blue-50 text-blue-700 text-xs p-3 rounded border border-blue-100">
                                        <strong>Tip:</strong> Add <code>https://your-domain.com/auth/google/callback</code> to your Google Cloud Console "Authorized redirect URIs".
                                    </div>
                                </div>
                            </div>

                            {/* Facebook */}
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                <h4 className="flex items-center gap-2 font-bold text-slate-700 mb-4">
                                    <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">f</span>
                                    Facebook Configuration
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Facebook App ID</label>
                                        <input
                                            value={settings.facebook_app_id || ''}
                                            onChange={(e) => handleChange('facebook_app_id', e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none"
                                            placeholder="1234567890"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Facebook App Secret</label>
                                        <input
                                            type="password"
                                            value={settings.facebook_app_secret || ''}
                                            onChange={(e) => handleChange('facebook_app_secret', e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none"
                                            placeholder="e.g. 8d9s8f9s..."
                                        />
                                    </div>
                                    <div className="bg-blue-50 text-blue-700 text-xs p-3 rounded border border-blue-100">
                                        <strong>Tip:</strong> Add <code>https://your-domain.com/auth/facebook/callback</code> to your Facebook App "Valid OAuth Redirect URIs".
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 5 && (
                        <div className="animate-fade-in">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Custom Code</h3>
                            <p className="text-sm text-slate-500 mb-4">Add custom CSS or JavaScript for tracking codes (e.g., Google Analytics).</p>
                            <div className="mb-6">
                                <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Custom CSS</label>
                                <textarea
                                    value={settings.custom_css}
                                    onChange={(e) => handleChange('custom_css', e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-green-400 font-mono text-xs focus:border-blue-500 outline-none h-40"
                                    placeholder=".my-class { color: red; }"
                                />
                            </div>
                        </div>
                    )}

                    {activeSection === 8 && (
                        <div className="animate-fade-in">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">System & Backup</h3>

                            <div className="p-6 border border-slate-200 rounded-xl bg-slate-50">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Database size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Database Backup</h4>
                                        <p className="text-slate-500 text-sm">Download a full JSON dump of your entire portfolio data.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleBackup}
                                    className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                                >
                                    <Download size={18} /> Download Backup (.json)
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;
