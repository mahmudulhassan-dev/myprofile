import React from 'react';
import { Terminal } from 'lucide-react';

const ActivityFeed = ({ logs }) => {
    return (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Terminal className="text-green-500" /> Activity Log
            </h3>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {logs && logs.map((log, index) => (
                    <div key={index} className="flex gap-4 p-3 rounded-lg hover:bg-slate-700/50 transition border-b border-slate-700/50 last:border-0">
                        <div className="mt-1">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        </div>
                        <div>
                            <p className="text-slate-300 text-sm font-medium">{log.action}</p>
                            <p className="text-slate-500 text-xs">{log.description}</p>
                            <p className="text-slate-600 text-[10px] mt-1">
                                {new Date(log.createdAt).toLocaleString()} • {log.ip_address}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityFeed;
