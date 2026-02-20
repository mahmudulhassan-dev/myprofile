import React, { useState, useEffect } from 'react';
import { MousePointer, Plus, Trash2, ArrowUp, ArrowDown, Save, Eye, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

const HomepageBuilder = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);

    // Available Sections Library
    const availableSections = [
        { type: 'hero', label: 'Hero Banner', icon: '🖼️' },
        { type: 'about', label: 'About Block', icon: '📝' },
        { type: 'services', label: 'Services Grid', icon: '🛠️' },
        { type: 'portfolio', label: 'Portfolio Grid', icon: '🎨' },
        { type: 'projects', label: 'Projects Carousel', icon: '📽️' },
        { type: 'testimonials', label: 'Testimonials', icon: '💬' },
        { type: 'features', label: 'Features List', icon: '✨' },
        { type: 'stats', label: 'Counters & Stats', icon: '📊' },
        { type: 'team', label: 'Team Members', icon: '👥' },
        { type: 'pricing', label: 'Pricing Table', icon: '💰' },
        { type: 'cta', label: 'Call to Action', icon: '📢' },
        { type: 'blog', label: 'Latest Posts', icon: '📰' },
        { type: 'newsletter', label: 'Newsletter Form', icon: '📧' },
        { type: 'custom', label: 'Custom HTML', icon: 'code' },
    ];

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/appearance/theme');
            const data = await res.json();
            if (data.homepage_sections) {
                // Ensure it's an array, might be stringified JSON
                let sect = data.homepage_sections;
                if (typeof sect === 'string') sect = JSON.parse(sect);
                setSections(sect || []);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const addSection = (type) => {
        const template = availableSections.find(s => s.type === type);
        const newSection = {
            id: `section_${Date.now()}`,
            type: type,
            label: template.label,
            settings: {} // Empty settings for now
        };
        setSections([...sections, newSection]);
    };

    const removeSection = (id) => {
        setSections(sections.filter(s => s.id !== id));
    };

    const moveSection = (index, direction) => {
        const newSections = [...sections];
        if (direction === 'up' && index > 0) {
            [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
        } else if (direction === 'down' && index < newSections.length - 1) {
            [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
        }
        setSections(newSections);
    };

    const handleSave = async () => {
        const toastId = toast.loading('Saving homepage layout...');
        try {
            await fetch('/api/appearance/theme', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ homepage_sections: JSON.stringify(sections) })
            });
            toast.success('Homepage updated!', { id: toastId });
        } catch (error) {
            toast.error('Failed to save', { id: toastId });
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 space-y-8 animate-fade-in flex gap-6">

            {/* Library (Left) */}
            <div className="w-1/3 space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm sticky top-6">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Plus className="text-blue-500" size={20} /> Add Section
                    </h3>
                    <div className="grid grid-cols-1 gap-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
                        {availableSections.map(s => (
                            <button
                                key={s.type}
                                onClick={() => addSection(s.type)}
                                className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition text-left group"
                            >
                                <span className="text-xl group-hover:scale-110 transition">{s.icon}</span>
                                <span className="font-medium text-slate-700 text-sm">{s.label}</span>
                                <Plus size={16} className="ml-auto text-slate-300 group-hover:text-blue-500" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Canvas (Right) */}
            <div className="w-2/3 space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <MousePointer className="text-purple-500" size={20} /> Homepage Canvas
                    </h3>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {sections.length} Sections
                    </span>
                </div>

                {sections.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400">
                        <MousePointer size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No sections added yet.</p>
                        <p className="text-sm">Click items on the left to add them.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sections.map((section, index) => (
                            <div key={section.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-blue-200 transition">
                                <span className="text-slate-300 font-bold w-6 text-center">{index + 1}</span>
                                <div className="p-2 bg-slate-50 rounded-lg text-2xl">{
                                    availableSections.find(s => s.type === section.type)?.icon
                                }</div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-700">{section.label}</h4>
                                    <p className="text-xs text-slate-400">ID: {section.id}</p>
                                </div>

                                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                                    <button
                                        onClick={() => moveSection(index, 'up')}
                                        disabled={index === 0}
                                        className="p-2 text-slate-400 hover:text-blue-600 disabled:opacity-30 hover:bg-slate-50 rounded"
                                    >
                                        <ArrowUp size={16} />
                                    </button>
                                    <button
                                        onClick={() => moveSection(index, 'down')}
                                        disabled={index === sections.length - 1}
                                        className="p-2 text-slate-400 hover:text-blue-600 disabled:opacity-30 hover:bg-slate-50 rounded"
                                    >
                                        <ArrowDown size={16} />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-green-600 hover:bg-slate-50 rounded" title="Settings">
                                        <Settings size={16} />
                                    </button>
                                    <button
                                        onClick={() => removeSection(section.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Save Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-4 rounded-full shadow-xl shadow-blue-500/30 font-bold hover:bg-blue-700 hover:scale-105 transition flex items-center gap-2">
                    <Save size={20} /> Save Homepage
                </button>
            </div>
        </div>
    );
};

export default HomepageBuilder;
