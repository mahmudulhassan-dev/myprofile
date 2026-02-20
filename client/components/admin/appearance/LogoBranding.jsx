import React, { useState, useEffect } from 'react';
import { Image, Upload, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const LogoBranding = () => {
    const [settings, setSettings] = useState({
        logo_light: '',
        logo_dark: '',
        favicon: '',
        brand_name: '',
        brand_tagline: '',
        brand_description: ''
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/appearance/theme');
            const data = await res.json();
            if (Object.keys(data).length > 0) {
                setSettings(prev => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error(error);
        }
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
            // Using existing upload endpoint
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
        const toastId = toast.loading('Saving branding...');
        try {
            await fetch('/api/appearance/theme', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            toast.success('Branding updated!', { id: toastId });
        } catch (error) {
            toast.error('Failed to save', { id: toastId });
        }
    };

    const UploadBox = ({ label, id, value, desc }) => (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-700 mb-1">{label}</h4>
            <p className="text-xs text-slate-400 mb-4">{desc}</p>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition relative group">
                {value ? (
                    <div className="relative inline-block">
                        <img src={value} alt="Preview" className="h-20 object-contain mx-auto" />
                        <button
                            onClick={() => handleChange(id, '')}
                            className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ) : (
                    <div className="text-slate-400">
                        <Image className="mx-auto mb-2 opacity-50" size={32} />
                        <span className="text-sm font-medium">Click to Upload</span>
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, id)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-20 space-y-8 animate-fade-in">
            {/* Logos */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <UploadBox id="logo_light" label="Main Logo (Light)" desc="Used on light backgrounds" value={settings.logo_light} />
                <UploadBox id="logo_dark" label="Inverse Logo (Dark)" desc="Used on dark backgrounds" value={settings.logo_dark} />
                <UploadBox id="favicon" label="Favicon" desc="Browser tab icon (32x32)" value={settings.favicon} />
            </section>

            {/* Brand Info */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Image className="text-pink-500" size={20} /> Brand Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Brand Name</label>
                        <input
                            value={settings.brand_name}
                            onChange={(e) => handleChange('brand_name', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 transition"
                            placeholder="e.g. Antigravity"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Tagline</label>
                        <input
                            value={settings.brand_tagline}
                            onChange={(e) => handleChange('brand_tagline', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 transition"
                            placeholder="e.g. Design the Future"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Brand Description</label>
                        <textarea
                            value={settings.brand_description}
                            onChange={(e) => handleChange('brand_description', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 transition h-24 resize-none"
                            placeholder="Brief description of your brand..."
                        />
                    </div>
                </div>
            </section>

            {/* Save Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-4 rounded-full shadow-xl shadow-blue-500/30 font-bold hover:bg-blue-700 hover:scale-105 transition flex items-center gap-2">
                    <Save size={20} /> Save Branding
                </button>
            </div>
        </div>
    );
};

export default LogoBranding;
