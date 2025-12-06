import React, { useState, useEffect } from 'react';
import { User, Share2, Briefcase, GraduationCap, Award, Settings, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Sub Components
import BasicInfoTab from './BasicInfoTab';
import SocialsTab from './SocialsTab';
import ExperienceTab from './ExperienceTab';
import EducationTab from './EducationTab';
import MediaTab from './MediaTab';
import SettingsTab from './SettingsTab';

const ProfileManager = () => {
    const [activeTab, setActiveTab] = useState('basic');
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/admin/profile');
            const data = await res.json();
            if (res.ok) {
                setProfileData(data);
            }
        } catch (error) {
            console.error('Failed to fetch profile', error);
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const tabs = [
        { id: 'basic', label: 'Basic Info', icon: User },
        { id: 'socials', label: 'Social Media', icon: Share2 },
        { id: 'experience', label: 'Experience', icon: Briefcase },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'media', label: 'Media', icon: ImageIcon },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    if (loading) return <div className="p-10 text-center text-slate-500">Loading Profile...</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[calc(100vh-8rem)] flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Profile Modules</h3>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === tab.id
                                ? 'bg-white shadow text-blue-600'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 overflow-y-auto bg-slate-50/30">
                <div className="max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'basic' && <BasicInfoTab data={profileData} refresh={fetchProfile} />}
                            {activeTab === 'socials' && <SocialsTab data={profileData?.socials} refresh={fetchProfile} />}
                            {activeTab === 'experience' && <ExperienceTab data={profileData?.experience} refresh={fetchProfile} />}
                            {activeTab === 'education' && <EducationTab data={profileData?.education} refresh={fetchProfile} />}
                            {activeTab === 'media' && <MediaTab data={profileData?.profile} refresh={fetchProfile} />}
                            {activeTab === 'settings' && <SettingsTab data={profileData?.profile} refresh={fetchProfile} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ProfileManager;
