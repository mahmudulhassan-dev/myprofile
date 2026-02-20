import React, { useState, useEffect } from 'react';
import { Camera, Save, User, FileText, Share2, Loader2, Linkedin, Github, Facebook, Youtube, Twitter, Instagram } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfileManager = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Profile Data (Profile Model)
    const [profile, setProfile] = useState({
        name: '', title: '', tagline: '', bio: '', image: '', email: '', phone: ''
    });

    // Social Data (Settings Model)
    const [socials, setSocials] = useState({
        social_github: '', social_linkedin: '', social_facebook: '', social_youtube: '', social_twitter: '', social_instagram: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Profile
                const dbRes = await fetch('/api/db');
                const dbData = await dbRes.json();
                if (dbData.profile) setProfile(dbData.profile);

                // Fetch Settings (for Socials)
                const settingsRes = await fetch('/api/settings');
                const settingsData = await settingsRes.json();

                // Extract social keys
                const newSocials = {};
                Object.keys(socials).forEach(key => {
                    if (settingsData[key]) newSocials[key] = settingsData[key];
                });
                setSocials(prev => ({ ...prev, ...newSocials }));

                setLoading(false);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load profile data");
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        const toastId = toast.loading('Uploading image...');
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.path) {
                setProfile(prev => ({ ...prev, image: data.path }));
                toast.success('Image uploaded!', { id: toastId });
            }
        } catch (error) {
            toast.error('Upload failed', { id: toastId });
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        const toastId = toast.loading('Saving profile...');

        try {
            // 1. Save Profile
            await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile)
            });

            // 2. Save Socials (to Settings)
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(socials)
            });

            toast.success('Profile updated successfully!', { id: toastId });
        } catch (error) {
            toast.error('Failed to save changes', { id: toastId });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-slate-400" /></div>;

    return (
        <form onSubmit={handleSave} className="animate-fade-in max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold font-sans text-slate-800">Edit Profile</h2>
                    <p className="text-slate-500">Manage your personal information and biography.</p>
                </div>
                <button
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-blue-500/20 disabled:opacity-70"
                >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Image & Basic Info */}
                <div className="space-y-6">
                    {/* Profile Image Card */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                        <div className="relative w-40 h-40 mx-auto mb-6 group">
                            <img
                                src={profile.image || '/profile.jpg'}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full border-4 border-slate-100 shadow-md"
                            />
                            <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                                <Camera className="text-white" size={32} />
                                <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                            </label>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Profile Picture</p>
                        <p className="text-xs text-slate-400">Click to change (JPG, PNG)</p>
                    </div>

                    {/* Social Links Card */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Share2 size={18} className="text-blue-500" /> Social Profiles
                        </h3>
                        <div className="space-y-4">
                            <div className="relative">
                                <Facebook className="absolute left-3 top-3 text-blue-600" size={18} />
                                <input
                                    value={socials.social_facebook}
                                    onChange={e => setSocials({ ...socials, social_facebook: e.target.value })}
                                    placeholder="Facebook URL"
                                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="relative">
                                <Github className="absolute left-3 top-3 text-slate-800" size={18} />
                                <input
                                    value={socials.social_github}
                                    onChange={e => setSocials({ ...socials, social_github: e.target.value })}
                                    placeholder="GitHub URL"
                                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="relative">
                                <Linkedin className="absolute left-3 top-3 text-blue-700" size={18} />
                                <input
                                    value={socials.social_linkedin}
                                    onChange={e => setSocials({ ...socials, social_linkedin: e.target.value })}
                                    placeholder="LinkedIn URL"
                                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="relative">
                                <Youtube className="absolute left-3 top-3 text-red-600" size={18} />
                                <input
                                    value={socials.social_youtube}
                                    onChange={e => setSocials({ ...socials, social_youtube: e.target.value })}
                                    placeholder="YouTube URL"
                                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <User size={18} className="text-purple-500" /> Personal Details
                        </h3>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Full Name</label>
                                <input
                                    value={profile.name}
                                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 font-bold text-slate-700"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Job Title / Designation</label>
                                <input
                                    value={profile.title}
                                    onChange={e => setProfile({ ...profile, title: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500"
                                    placeholder="e.g. Full Stack Developer"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Tagline (Hero Section)</label>
                            <input
                                value={profile.tagline}
                                onChange={e => setProfile({ ...profile, tagline: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500"
                                placeholder="e.g. Building Digital Empires"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Biography (About Me)</label>
                            <textarea
                                value={profile.bio}
                                onChange={e => setProfile({ ...profile, bio: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 outline-none focus:border-blue-500 h-40 resize-none text-slate-600 leading-relaxed"
                                placeholder="Write a short bio about yourself..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ProfileManager;
