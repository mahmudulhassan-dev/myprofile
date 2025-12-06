import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, FileText, Trash2, Copy, Grid, List } from 'lucide-react';
import toast from 'react-hot-toast';

const MediaManager = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [filter, setFilter] = useState('all'); // all, image, file

    const fetchFiles = async () => {
        try {
            const res = await fetch('/api/files');
            const data = await res.json();
            setFiles(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            if (res.ok) {
                toast.success('File uploaded');
                fetchFiles();
            } else {
                toast.error('Upload failed');
            }
        } catch (error) {
            toast.error('Error uploading');
        } finally {
            setUploading(false);
        }
    };

    const copyLink = (path) => {
        navigator.clipboard.writeText(path);
        toast.success('Link copied!');
    };

    const filteredFiles = files.filter(f => filter === 'all' || f.type === filter);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold font-sans">Media Library</h2>
                <div className="flex gap-4">
                    <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 transition">
                        <Upload size={18} /> {uploading ? 'Uploading...' : 'Upload New'}
                        <input type="file" className="hidden" onChange={handleUpload} />
                    </label>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 border-b border-slate-200 pb-4">
                {['all', 'image', 'file'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1 rounded-full text-sm font-medium capitalize transition ${filter === f ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        {f}s
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredFiles.map((file, i) => (
                    <div key={i} className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden aspect-square hover:shadow-lg transition">
                        {file.type === 'image' ? (
                            <img src={file.path} alt={file.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">
                                <FileText size={40} />
                            </div>
                        )}

                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                            <button
                                onClick={() => copyLink(file.path)}
                                className="bg-white p-2 rounded-full text-slate-800 hover:text-blue-600 transition"
                                title="Copy Link"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur p-2 text-xs truncate font-medium text-slate-600 px-3">
                            {file.name}
                        </div>
                    </div>
                ))}
            </div>

            {filteredFiles.length === 0 && (
                <div className="text-center py-20 text-slate-400">
                    <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No files found.</p>
                </div>
            )}
        </div>
    );
};

export default MediaManager;
