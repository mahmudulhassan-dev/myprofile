
import React from 'react';
import { Settings } from 'lucide-react';

const MHSettings = () => {
    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                    <Settings size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Commerce Settings</h1>
                    <p className="text-slate-500">Configure your store settings</p>
                </div>
            </div>

            <div className="bg-white border boundary-slate-200 rounded-xl p-10 flex flex-col items-center justify-center min-h-[400px]">
                <h3 className="text-xl font-bold text-slate-400">Global Store Configuration</h3>
                <p className="text-slate-400 max-w-md text-center mt-2">
                    Currency, Tax, Shipping, and Email settings.
                </p>
            </div>
        </div>
    );
};

export default MHSettings;
