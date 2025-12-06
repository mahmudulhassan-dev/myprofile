import React, { useState } from 'react';
import { Layers, Activity, Code, Bug } from 'lucide-react';
import PlatformSettings from './PlatformSettings';
import EventManager from './EventManager';
import ScriptManager from './ScriptManager';
import PixelDebugger from './PixelDebugger';

const PixelManager = () => {
    const [activeTab, setActiveTab] = useState('platforms');

    const tabs = [
        { id: 'platforms', label: 'Platforms', icon: Layers },
        { id: 'events', label: 'Events & Rules', icon: Activity },
        { id: 'scripts', label: 'Custom Scripts', icon: Code },
        { id: 'debug', label: 'Debugger', icon: Bug },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Pixel & Automation</h1>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[500px]">
                {activeTab === 'platforms' && <PlatformSettings />}
                {activeTab === 'events' && <EventManager />}
                {activeTab === 'scripts' && <ScriptManager />}
                {activeTab === 'debug' && <PixelDebugger />}
            </div>
        </div>
    );
};

export default PixelManager;
