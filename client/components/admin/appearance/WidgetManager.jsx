import React, { useState, useEffect } from 'react';
import { Box, Plus, Trash2, Edit, Save, Smartphone, Monitor } from 'lucide-react';
import toast from 'react-hot-toast';

const WidgetManager = () => {
    // Mock Widgets Data for now
    const [widgets, setWidgets] = useState([
        { id: 1, type: 'search', title: 'Search', position: 'sidebar', order: 0 },
        { id: 2, type: 'categories', title: 'Categories', position: 'sidebar', order: 1 },
        { id: 3, type: 'newsletter', title: 'Newsletter', position: 'footer-1', order: 0 },
        { id: 4, type: 'contact', title: 'Contact Info', position: 'footer-2', order: 0 },
    ]);

    const widgetTypes = [
        { type: 'search', label: 'Search Bar' },
        { type: 'categories', label: 'Category List' },
        { type: 'tags', label: 'Tag Cloud' },
        { type: 'posts', label: 'Recent Posts' },
        { type: 'social', label: 'Social Icons' },
        { type: 'newsletter', label: 'Newsletter Box' },
        { type: 'html', label: 'Custom HTML' },
        { type: 'contact', label: 'Contact Info' },
    ];

    const positions = [
        { id: 'sidebar', label: 'Main Sidebar' },
        { id: 'footer-1', label: 'Footer Column 1' },
        { id: 'footer-2', label: 'Footer Column 2' },
        { id: 'footer-3', label: 'Footer Column 3' },
        { id: 'footer-4', label: 'Footer Column 4' },
    ];

    const addWidget = (position) => {
        const newWidget = {
            id: Date.now(),
            type: 'html',
            title: 'New Widget',
            position: position,
            order: widgets.filter(w => w.position === position).length
        };
        setWidgets([...widgets, newWidget]);
    };

    const removeWidget = (id) => {
        setWidgets(widgets.filter(w => w.id !== id));
    };

    const handleSave = () => {
        toast.success('Widgets saved successfully!');
        // API Call placeholder
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 space-y-8 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Box className="text-pink-500" size={20} /> Widget Manager
                    </h3>
                    <p className="text-sm text-slate-500">Manage widgets for sidebar and footer areas.</p>
                </div>
                <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition flex items-center gap-2">
                    <Save size={16} /> Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {positions.map(pos => (
                    <div key={pos.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col min-h-[300px]">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                            <h4 className="font-bold text-slate-700 text-sm uppercase">{pos.label}</h4>
                            <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                {widgets.filter(w => w.position === pos.id).length}
                            </span>
                        </div>

                        <div className="flex-1 space-y-3">
                            {widgets.filter(w => w.position === pos.id).map(widget => (
                                <div key={widget.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm group hover:border-blue-300 transition cursor-move">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-slate-700 text-sm">{widget.title}</span>
                                        <button onClick={() => removeWidget(widget.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-slate-500 uppercase bg-slate-100 px-1.5 rounded">{widgetTypes.find(t => t.type === widget.type)?.label || widget.type}</span>
                                        <button className="text-blue-500 hover:underline text-xs flex items-center gap-1">
                                            <Edit size={12} /> Edit
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {widgets.filter(w => w.position === pos.id).length === 0 && (
                                <div className="text-center py-8 text-slate-400 text-sm italic">
                                    No widgets in this area
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => addWidget(pos.id)}
                            className="mt-4 w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 text-sm font-medium hover:bg-white hover:border-blue-300 hover:text-blue-500 transition flex items-center justify-center gap-2"
                        >
                            <Plus size={16} /> Add Widget
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WidgetManager;
