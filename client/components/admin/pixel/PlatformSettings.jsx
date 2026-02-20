import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Save, CheckCircle, XCircle, Facebook, Instagram, Hash, Globe } from 'lucide-react';

const PlatformCard = ({ platform, icon: Icon, label, color, config, onSave }) => {
    const [pixelId, setPixelId] = useState(config?.pixel_id || '');
    const [isActive, setIsActive] = useState(config?.is_active || false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (config) {
            setPixelId(config.pixel_id || '');
            setIsActive(config.is_active || false);
        }
    }, [config]);

    const handleSave = async () => {
        setLoading(true);
        try {
            await onSave({ platform, pixel_id: pixelId, is_active: isActive });
            toast.success(`${label} Updated`);
        } catch (error) {
            toast.error('Failed to update');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border border-slate-200 rounded-lg p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${color} text-white`}>
                        <Icon size={20} />
                    </div>
                    <span className="font-bold text-slate-700">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsActive(!isActive)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? 'bg-green-500' : 'bg-slate-300'
                            }`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Pixel / Measurement ID</label>
                <input
                    type="text"
                    value={pixelId}
                    onChange={(e) => setPixelId(e.target.value)}
                    placeholder="e.g. G-XXXXXXXXXX"
                    className="w-full mt-1 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={!isActive}
                />
            </div>

            <button
                onClick={handleSave}
                disabled={loading}
                className="mt-auto w-full py-2 bg-slate-900 text-white rounded hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
                {loading ? 'Saving...' : <><Save size={16} /> Save Config</>}
            </button>
        </div>
    );
};

const PlatformSettings = () => {
    const [configs, setConfigs] = useState({});
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            const res = await fetch('/api/pixel/admin/configs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            // Convert array to object
            const configMap = {};
            data.forEach(c => configMap[c.platform] = c);
            setConfigs(configMap);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (data) => {
        const res = await fetch('/api/pixel/admin/configs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed');
        fetchConfigs();
    };

    if (loading) return <div>Loading Platforms...</div>;

    const platforms = [
        { id: 'facebook', label: 'Facebook Pixel', icon: Facebook, color: 'bg-blue-600' },
        { id: 'tiktok', label: 'TikTok Pixel', icon: Hash, color: 'bg-black' },
        { id: 'google-analytics', label: 'Google Analytics 4', icon: Globe, color: 'bg-orange-500' },
        { id: 'gtm', label: 'Google Tag Manager', icon: Globe, color: 'bg-blue-500' },
        { id: 'pinterest', label: 'Pinterest Tag', icon: Hash, color: 'bg-red-600' },
        { id: 'linkedin', label: 'LinkedIn Insight', icon: Hash, color: 'bg-blue-700' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map(p => (
                <PlatformCard
                    key={p.id}
                    platform={p.id}
                    icon={p.icon}
                    label={p.label}
                    color={p.color}
                    config={configs[p.id]}
                    onSave={handleSave}
                />
            ))}
        </div>
    );
};

export default PlatformSettings;
