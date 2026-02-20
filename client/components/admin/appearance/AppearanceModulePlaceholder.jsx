import React from 'react';
import { Construction } from 'lucide-react';

const AppearanceModulePlaceholder = ({ title, description }) => {
    return (
        <div className="flex flex-col items-center justify-center h-96 text-center p-8 bg-white rounded-2xl border border-slate-100 shadow-sm animate-fade-in">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                <Construction size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
            <p className="text-slate-500 max-w-md mx-auto">{description || "This module is currently under development. Features will be available soon."}</p>
        </div>
    );
};

export default AppearanceModulePlaceholder;
