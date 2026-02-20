import React, { useState } from 'react';
import { LayoutDashboard, GripVertical, Eye, EyeOff, RotateCcw, Palette, Settings, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardSettings = ({ settings, handleChange }) => {

    const [widgets, setWidgets] = useState([
        { id: 'stats', name: 'Statistics Cards', visible: true, order: 0 },
        { id: 'chart_visits', name: 'Visits Chart', visible: true, order: 1 },
        { id: 'chart_revenue', name: 'Revenue Chart', visible: true, order: 2 },
        { id: 'recent_orders', name: 'Recent Orders', visible: true, order: 3 },
        { id: 'recent_users', name: 'Recent Users', visible: true, order: 4 },
        { id: 'quick_actions', name: 'Quick Actions', visible: true, order: 5 },
        { id: 'activity_log', name: 'Activity Log', visible: true, order: 6 },
        { id: 'notifications', name: 'Notifications Panel', visible: true, order: 7 },
        { id: 'calendar', name: 'Calendar Widget', visible: false, order: 8 },
        { id: 'todo', name: 'Todo List', visible: false, order: 9 },
        { id: 'analytics', name: 'Analytics Summary', visible: true, order: 10 },
        { id: 'world_map', name: 'World Map', visible: false, order: 11 },
    ]);

    const dashboardThemes = [
        { id: 'default', name: 'Default', colors: ['#f8fafc', '#e2e8f0', '#334155'] },
        { id: 'dark', name: 'Dark', colors: ['#0f172a', '#1e293b', '#f8fafc'] },
        { id: 'blue', name: 'Ocean Blue', colors: ['#0c4a6e', '#0369a1', '#bae6fd'] },
        { id: 'purple', name: 'Royal Purple', colors: ['#3b0764', '#7c3aed', '#ede9fe'] },
        { id: 'green', name: 'Forest Green', colors: ['#14532d', '#15803d', '#dcfce7'] },
        { id: 'warm', name: 'Warm Sunset', colors: ['#7c2d12', '#ea580c', '#fed7aa'] },
    ];

    const toggleWidgetVisibility = (id) => {
        setWidgets(prev => prev.map(w =>
            w.id === id ? { ...w, visible: !w.visible } : w
        ));
        handleChange('dashboard_widgets', JSON.stringify(widgets.map(w =>
            w.id === id ? { ...w, visible: !w.visible } : w
        )));
    };

    const resetDashboard = () => {
        const defaultWidgets = widgets.map((w, i) => ({ ...w, visible: i < 8, order: i }));
        setWidgets(defaultWidgets);
        handleChange('dashboard_widgets', JSON.stringify(defaultWidgets));
        handleChange('dashboard_theme', 'default');
        toast.success('Dashboard reset to defaults');
    };

    const moveWidget = (fromIndex, toIndex) => {
        if (toIndex < 0 || toIndex >= widgets.length) return;

        const newWidgets = [...widgets];
        const [removed] = newWidgets.splice(fromIndex, 1);
        newWidgets.splice(toIndex, 0, removed);

        // Update order
        const reordered = newWidgets.map((w, i) => ({ ...w, order: i }));
        setWidgets(reordered);
        handleChange('dashboard_widgets', JSON.stringify(reordered));
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Widget Manager */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-50">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <LayoutDashboard className="text-blue-500" size={20} /> Dashboard Widgets
                    </h3>
                    <button
                        onClick={resetDashboard}
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition"
                    >
                        <RotateCcw size={16} /> Reset to Default
                    </button>
                </div>

                <p className="text-sm text-slate-500 mb-4">Drag to reorder widgets. Click the eye icon to show/hide.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {widgets.sort((a, b) => a.order - b.order).map((widget, index) => (
                        <div
                            key={widget.id}
                            draggable
                            onDragStart={(e) => e.dataTransfer.setData('text/plain', index)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const fromIndex = Number(e.dataTransfer.getData('text/plain'));
                                moveWidget(fromIndex, index);
                            }}
                            className={`flex items-center justify-between p-4 rounded-xl border transition cursor-grab active:cursor-grabbing ${widget.visible
                                    ? 'border-green-200 bg-green-50'
                                    : 'border-slate-200 bg-slate-50 opacity-60'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <GripVertical className="text-slate-400" size={18} />
                                <span className="font-medium text-slate-700">{widget.name}</span>
                            </div>
                            <button
                                onClick={() => toggleWidgetVisibility(widget.id)}
                                className={`p-2 rounded-lg transition ${widget.visible
                                        ? 'text-green-600 hover:bg-green-100'
                                        : 'text-slate-400 hover:bg-slate-200'
                                    }`}
                            >
                                {widget.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Dashboard Theme */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Palette className="text-purple-500" size={20} /> Dashboard Theme
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {dashboardThemes.map(theme => (
                        <button
                            key={theme.id}
                            onClick={() => handleChange('dashboard_theme', theme.id)}
                            className={`p-4 rounded-xl border-2 transition ${settings.dashboard_theme === theme.id
                                    ? 'border-blue-600 ring-2 ring-blue-200'
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <div className="flex gap-1 mb-3">
                                {theme.colors.map((color, i) => (
                                    <div
                                        key={i}
                                        className="w-6 h-6 rounded-full shadow-sm border border-white"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-medium text-slate-700">{theme.name}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Layout Options */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Settings className="text-slate-500" size={20} /> Layout Options
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Widget Columns</label>
                        <select
                            value={settings.dashboard_columns || '3'}
                            onChange={(e) => handleChange('dashboard_columns', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            <option value="2">2 Columns</option>
                            <option value="3">3 Columns</option>
                            <option value="4">4 Columns</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Widget Gap</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="8"
                                max="32"
                                step="4"
                                value={settings.dashboard_gap || 16}
                                onChange={(e) => handleChange('dashboard_gap', e.target.value)}
                                className="flex-1 accent-blue-600"
                            />
                            <span className="text-sm font-mono text-slate-600 w-12 text-right">{settings.dashboard_gap || 16}px</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div>
                            <h4 className="font-bold text-sm text-slate-700">Compact Mode</h4>
                            <p className="text-xs text-slate-400">Reduce padding for more info density</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.dashboard_compact === 'true'}
                                onChange={(e) => handleChange('dashboard_compact', String(e.target.checked))}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div>
                            <h4 className="font-bold text-sm text-slate-700">Show Welcome Banner</h4>
                            <p className="text-xs text-slate-400">Display personalized welcome message</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.dashboard_welcome !== 'false'}
                                onChange={(e) => handleChange('dashboard_welcome', String(e.target.checked))}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </section>

            {/* Quick Stats Customization */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Plus className="text-green-500" size={20} /> Quick Stats Cards
                </h3>
                <p className="text-sm text-slate-500 mb-4">Choose which stats to display in the top cards.</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { id: 'total_revenue', label: 'Total Revenue' },
                        { id: 'total_orders', label: 'Total Orders' },
                        { id: 'total_users', label: 'Total Users' },
                        { id: 'total_products', label: 'Total Products' },
                        { id: 'conversion_rate', label: 'Conversion Rate' },
                        { id: 'avg_order', label: 'Avg. Order Value' },
                        { id: 'page_views', label: 'Page Views' },
                        { id: 'pending_orders', label: 'Pending Orders' },
                    ].map(stat => (
                        <label
                            key={stat.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${settings[`show_stat_${stat.id}`] !== 'false'
                                    ? 'border-green-200 bg-green-50'
                                    : 'border-slate-200 bg-slate-50'
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={settings[`show_stat_${stat.id}`] !== 'false'}
                                onChange={(e) => handleChange(`show_stat_${stat.id}`, String(e.target.checked))}
                                className="w-4 h-4 accent-green-600"
                            />
                            <span className="text-sm text-slate-700">{stat.label}</span>
                        </label>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default DashboardSettings;
