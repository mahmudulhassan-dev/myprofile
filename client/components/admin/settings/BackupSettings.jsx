import React, { useState, useEffect } from 'react';
import { Database, Download, Upload, Clock, HardDrive, Calendar, RefreshCw, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const BackupSettings = ({ settings, handleChange }) => {

    const [backups, setBackups] = useState([]);
    const [isCreatingBackup, setIsCreatingBackup] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBackupHistory();
    }, []);

    // Fetch backup history from API
    const fetchBackupHistory = async () => {
        try {
            const res = await fetch('/api/settings/backup/history');
            if (res.ok) {
                const data = await res.json();
                setBackups(data);
            }
        } catch (error) {
            console.error('Failed to fetch backup history:', error);
        } finally {
            setLoading(false);
        }
    };

    const scheduleOptions = [
        { value: 'never', label: 'Never (Manual Only)' },
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
    ];

    const retentionOptions = [
        { value: '5', label: 'Keep last 5 backups' },
        { value: '10', label: 'Keep last 10 backups' },
        { value: '30', label: 'Keep last 30 backups' },
        { value: 'all', label: 'Keep all backups' },
    ];

    const createBackup = async () => {
        setIsCreatingBackup(true);
        const toastId = toast.loading('Creating backup...');

        try {
            const response = await fetch('/api/settings/backup');
            if (response.ok) {
                // Download the backup file
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);

                toast.success('Backup created and downloaded!', { id: toastId });
                // Refresh history
                fetchBackupHistory();
            } else {
                toast.error('Backup creation failed', { id: toastId });
            }
        } catch (error) {
            toast.error('Backup creation failed', { id: toastId });
        } finally {
            setIsCreatingBackup(false);
        }
    };

    const downloadBackup = async (filename) => {
        const toastId = toast.loading('Preparing download...');
        try {
            const response = await fetch(`/api/settings/backup/download/${filename}`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
                toast.success('Download started!', { id: toastId });
            }
        } catch (error) {
            toast.error('Download failed', { id: toastId });
        }
    };

    const deleteBackup = async (backupId) => {
        if (!confirm('Are you sure you want to delete this backup?')) return;

        const toastId = toast.loading('Deleting backup...');
        try {
            const response = await fetch(`/api/settings/backup/${backupId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setBackups(backups.filter(b => b.id !== backupId));
                toast.success('Backup deleted', { id: toastId });
            }
        } catch (error) {
            toast.error('Delete failed', { id: toastId });
        }
    };

    const restoreBackup = async (file) => {
        if (!confirm('⚠️ WARNING: This will overwrite all current data. Are you sure?')) return;

        const toastId = toast.loading('Restoring backup...');
        try {
            const fileContent = await file.text();
            const backupData = JSON.parse(fileContent);

            const response = await fetch('/api/settings/backup/restore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(backupData)
            });

            if (response.ok) {
                toast.success('Database restored successfully!', { id: toastId });
                setTimeout(() => window.location.reload(), 2000);
            } else {
                toast.error('Restore failed', { id: toastId });
            }
        } catch (error) {
            toast.error('Invalid backup file', { id: toastId });
        }
    };

    const ToggleSwitch = ({ label, description, settingKey }) => (
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
                <h4 className="font-bold text-sm text-slate-700">{label}</h4>
                {description && <p className="text-xs text-slate-400">{description}</p>}
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={settings[settingKey] === 'true' || settings[settingKey] === true}
                    onChange={(e) => handleChange(settingKey, String(e.target.checked))}
                    className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Quick Actions */}
            <section className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg text-white">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Database size={20} /> Backup Manager
                    </h3>
                    <div className="flex gap-3">
                        <button
                            onClick={createBackup}
                            disabled={isCreatingBackup}
                            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
                        >
                            {isCreatingBackup ? <RefreshCw className="animate-spin" size={16} /> : <Database size={16} />}
                            Create Backup
                        </button>
                        <button
                            onClick={downloadBackup}
                            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                            <Download size={16} /> Download Latest
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 rounded-xl p-4">
                        <p className="text-sm text-white/70 mb-1">Total Backups</p>
                        <p className="text-2xl font-bold">{backups.length}</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                        <p className="text-sm text-white/70 mb-1">Last Backup</p>
                        <p className="text-lg font-medium">{backups[0]?.date || 'Never'}</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                        <p className="text-sm text-white/70 mb-1">Total Size</p>
                        <p className="text-2xl font-bold">9.2 MB</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                        <p className="text-sm text-white/70 mb-1">Auto Backup</p>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${settings.auto_backup_enabled === 'true' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                            <span className="text-lg font-medium">{settings.auto_backup_enabled === 'true' ? 'Active' : 'Disabled'}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Auto Backup Settings */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Clock className="text-blue-500" size={20} /> Automatic Backup
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <ToggleSwitch label="Enable Auto Backup" description="Automatically create backups on schedule" settingKey="auto_backup_enabled" />
                    <ToggleSwitch label="Include Media Files" description="Backup uploaded images and files" settingKey="backup_include_media" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Backup Schedule</label>
                        <select
                            value={settings.backup_schedule || 'daily'}
                            onChange={(e) => handleChange('backup_schedule', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            {scheduleOptions.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Backup Time</label>
                        <input
                            type="time"
                            value={settings.backup_time || '03:00'}
                            onChange={(e) => handleChange('backup_time', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Retention Policy</label>
                        <select
                            value={settings.backup_retention || '10'}
                            onChange={(e) => handleChange('backup_retention', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            {retentionOptions.map(r => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* Backup History */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Calendar className="text-purple-500" size={20} /> Backup History
                </h3>

                <div className="space-y-3">
                    {backups.map(backup => (
                        <div
                            key={backup.id}
                            className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${backup.type === 'auto' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                    {backup.type === 'auto' ? <Clock size={18} /> : <Database size={18} />}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800">{backup.name}</p>
                                    <p className="text-xs text-slate-500">{backup.date} • {backup.size}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${backup.type === 'auto' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                    {backup.type === 'auto' ? 'Automatic' : 'Manual'}
                                </span>
                                <button
                                    onClick={() => downloadBackup(backup.filename)}
                                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition"
                                    title="Download"
                                >
                                    <Download size={16} />
                                </button>
                                <button
                                    onClick={() => deleteBackup(backup.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Restore Backup */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Upload className="text-amber-500" size={20} /> Restore Backup
                </h3>

                <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl text-center hover:bg-slate-50 transition cursor-pointer relative">
                    <Upload size={32} className="mx-auto text-slate-400 mb-3" />
                    <p className="font-medium text-slate-700 mb-1">Drop backup file here or click to upload</p>
                    <p className="text-xs text-slate-400">Supported format: .json (Max 100MB)</p>
                    <input
                        type="file"
                        accept=".json"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                            if (e.target.files[0]) {
                                restoreBackup(e.target.files[0]);
                            }
                        }}
                    />
                </div>

                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                            <h4 className="font-bold text-amber-800">Warning</h4>
                            <p className="text-sm text-amber-700">Restoring a backup will overwrite all current data. This action cannot be undone. Make sure to create a backup of current data before restoring.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BackupSettings;
