import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Upload, FileText, Image, Video } from 'lucide-react';

const MediaTab = ({ data, refresh }) => {
    const [uploading, setUploading] = useState(false);

    // This is a simplified uploader. In a real scenario, this would post to /api/upload
    // For now, we simulate or assume the user has a way to get URL, OR we build a simple upload handler.
    // Given the previous codebase had file upload logic (`/api/files/upload`), we should use that or basic URL inputs for now.
    // Let's implement URL inputs for simplicity unless requested otherwise, as React file upload needs a dedicated endpoint we haven't explicitly built for profile fields yet.
    // WAIT: The Profile model has text fields for URLs. 
    // We can provide URL inputs + a button to "Pick from Media Manager" (if we had one connected) or a basic file input that POSTs to upload.
    // Let's use simple URL inputs for now to ensure reliability.

    const [formData, setFormData] = useState(data || {});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setUploading(true);
        try {
            const res = await fetch('/api/admin/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                toast.success('Media settings saved');
                refresh();
            } else {
                toast.error('Save failed');
            }
        } catch (error) { toast.error('Network error'); }
        finally { setUploading(false); }
    };

    return (
        <div className="space-y-8">
            <h3 className="text-lg font-bold text-slate-700">Profile Media & Assets</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Avatar */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                        <Image className="text-blue-500" />
                        <label className="font-semibold text-slate-700">Profile Avatar URL</label>
                    </div>
                    {formData.avatar && <img src={formData.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-slate-100" />}
                    <input name="avatar" value={formData.avatar || ''} onChange={handleChange} placeholder="https://..." className="w-full p-3 border rounded-xl text-sm" />
                    <p className="text-xs text-slate-400 mt-2">Recommended: 400x400px Square JPG/PNG</p>
                </div>

                {/* Cover Photo */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                        <Image className="text-purple-500" />
                        <label className="font-semibold text-slate-700">Cover Photo URL</label>
                    </div>
                    {formData.cover_photo && <img src={formData.cover_photo} alt="Cover" className="w-full h-24 rounded-lg object-cover mb-4" />}
                    <input name="cover_photo" value={formData.cover_photo || ''} onChange={handleChange} placeholder="https://..." className="w-full p-3 border rounded-xl text-sm" />
                    <p className="text-xs text-slate-400 mt-2">Recommended: 1200x400px Landscape JPG</p>
                </div>

                {/* Resume */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="text-red-500" />
                        <label className="font-semibold text-slate-700">Resume / CV PDF URL</label>
                    </div>
                    <input name="resume_url" value={formData.resume_url || ''} onChange={handleChange} placeholder="https://..." className="w-full p-3 border rounded-xl text-sm" />
                </div>

                {/* Video */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                        <Video className="text-green-500" />
                        <label className="font-semibold text-slate-700">Intro Video URL</label>
                    </div>
                    <input name="intro_video_url" value={formData.intro_video_url || ''} onChange={handleChange} placeholder="https://..." className="w-full p-3 border rounded-xl text-sm" />
                </div>
            </div>

            <div className="flex justify-end">
                <button onClick={handleSave} disabled={uploading} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50">
                    {uploading ? 'Saving...' : 'Save Media Settings'}
                </button>
            </div>
        </div>
    );
};
export default MediaTab;
