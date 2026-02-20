import React from 'react';
import { UploadCloud, Server, HardDrive, Shield } from 'lucide-react';

const StorageSettings = ({ settings, handleChange }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* 7.1 File Storage Options */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <HardDrive className="text-blue-600" size={20} /> 7.1 Storage Provider
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {['local', 's3', 'r2', 'firebase', 'gdrive'].map(provider => (
                        <div
                            key={provider}
                            onClick={() => handleChange('storage_provider', provider)}
                            className={`p-4 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition ${settings.storage_provider === provider
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300'
                                }`}
                        >
                            <span className="capitalize font-bold text-sm">{provider === 'gdrive' ? 'Google Drive' : provider === 'r2' ? 'Cloudflare R2' : provider}</span>
                        </div>
                    ))}
                </div>

                {settings.storage_provider === 's3' && (
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4 animate-fade-in">
                        <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><Server size={16} /> AWS S3 Configuration</h4>
                        <div className="grid grid-cols-2 gap-6">
                            <input value={settings.aws_bucket || ''} onChange={(e) => handleChange('aws_bucket', e.target.value)} placeholder="Bucket Name" className="p-3 rounded-lg border border-slate-300 w-full outline-none" />
                            <input value={settings.aws_region || ''} onChange={(e) => handleChange('aws_region', e.target.value)} placeholder="Region (us-east-1)" className="p-3 rounded-lg border border-slate-300 w-full outline-none" />
                            <input value={settings.aws_access_key || ''} onChange={(e) => handleChange('aws_access_key', e.target.value)} placeholder="Access Key ID" className="p-3 rounded-lg border border-slate-300 w-full outline-none" />
                            <input type="password" value={settings.aws_secret_key || ''} onChange={(e) => handleChange('aws_secret_key', e.target.value)} placeholder="Secret Access Key" className="p-3 rounded-lg border border-slate-300 w-full outline-none" />
                        </div>
                    </div>
                )}

                {settings.storage_provider === 'r2' && (
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4 animate-fade-in">
                        <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><UploadCloud size={16} /> Cloudflare R2 Configuration</h4>
                        <div className="grid grid-cols-2 gap-6">
                            <input value={settings.r2_bucket || ''} onChange={(e) => handleChange('r2_bucket', e.target.value)} placeholder="Bucket Name" className="p-3 rounded-lg border border-slate-300 w-full outline-none" />
                            <input value={settings.r2_account_id || ''} onChange={(e) => handleChange('r2_account_id', e.target.value)} placeholder="Account ID" className="p-3 rounded-lg border border-slate-300 w-full outline-none" />
                            <input value={settings.r2_access_key || ''} onChange={(e) => handleChange('r2_access_key', e.target.value)} placeholder="Access Key ID" className="p-3 rounded-lg border border-slate-300 w-full outline-none" />
                            <input type="password" value={settings.r2_secret_key || ''} onChange={(e) => handleChange('r2_secret_key', e.target.value)} placeholder="Secret Access Key" className="p-3 rounded-lg border border-slate-300 w-full outline-none" />
                        </div>
                    </div>
                )}
            </section>

            {/* 7.2 File Rules */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Shield className="text-purple-600" size={20} /> 7.2 Permissions & Limits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Max Upload Size (MB)</label>
                        <input
                            type="number"
                            value={settings.max_upload_size || '10'}
                            onChange={(e) => handleChange('max_upload_size', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Allowed File Types</label>
                        <input
                            value={settings.allowed_file_types || 'jpg,png,pdf,docx,zip'}
                            onChange={(e) => handleChange('allowed_file_types', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none"
                        />
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                        <h4 className="text-sm font-bold text-slate-700">Auto-Rename Duplicates</h4>
                        <p className="text-xs text-slate-500">Append number if file exists (e.g., image-1.jpg)</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={settings.auto_rename_files !== false} onChange={(e) => handleChange('auto_rename_files', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                </div>
            </section>
        </div>
    );
};

export default StorageSettings;
