import React, { useState, useEffect } from 'react';
import { Activity, Server, Database, HardDrive, Cpu, AlertTriangle } from 'lucide-react';

const SystemSettings = ({ settings, handleChange }) => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetch('/api/settings/status')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error(err));
    }, []);

    const StatCard = ({ label, value, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">{label}</p>
                <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
            </div>
            <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
                <Icon size={24} />
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="CPU Usage" value={stats?.cpuUsage || '...'} icon={Cpu} color="blue" />
                <StatCard label="RAM Usage" value={stats?.ramUsage || '...'} icon={Activity} color="purple" />
                <StatCard label="Storage" value={stats?.storageUsage || '...'} icon={HardDrive} color="orange" />
                <StatCard label="Node Version" value={stats?.nodeVersion || '...'} icon={Server} color="green" />
            </div>

            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Database className="text-red-500" size={20} /> 8. Backup & Maintenance
                </h3>

                <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-100 rounded-xl mb-6">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="text-yellow-600" size={24} />
                        <div>
                            <h4 className="text-yellow-800 font-bold text-sm">Maintenance Mode</h4>
                            <p className="text-yellow-700/80 text-xs">Only admins can access the site when enabled.</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={settings.maintenance_mode || false} onChange={(e) => handleChange('maintenance_mode', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-yellow-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-yellow-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                    </label>
                </div>

                <div className="mb-6">
                    <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Maintenance Message</label>
                    <textarea
                        value={settings.maintenance_message || 'We are undergoing scheduled maintenance.'}
                        onChange={(e) => handleChange('maintenance_message', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none h-24"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                        <Database className="mx-auto text-blue-500 mb-3" size={32} />
                        <h4 className="font-bold text-slate-800 mb-2">Full Database Backup</h4>
                        <p className="text-xs text-slate-500 mb-4">Download a complete JSON dump of all tables.</p>
                        <button onClick={() => window.open('/api/settings/backup', '_blank')} className="bg-blue-600 text-white w-full py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
                            Download Backup
                        </button>
                    </div>
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                        <Activity className="mx-auto text-green-500 mb-3" size={32} />
                        <h4 className="font-bold text-slate-800 mb-2">Error Logs</h4>
                        <p className="text-xs text-slate-500 mb-4">View system error logs for debugging.</p>
                        <button className="bg-white border border-slate-300 text-slate-700 w-full py-2.5 rounded-lg text-sm font-bold hover:bg-slate-100 transition">
                            View Log File
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SystemSettings;
