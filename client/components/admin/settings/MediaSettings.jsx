import React from 'react';
import { Image, Zap, HardDrive, Settings, Upload, FileType, Layers, Crop } from 'lucide-react';

const MediaSettings = ({ settings, handleChange }) => {

    const ToggleSwitch = ({ label, description, settingKey, icon: Icon }) => (
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
                {Icon && <Icon size={20} className="text-slate-400" />}
                <div>
                    <h4 className="font-bold text-sm text-slate-700">{label}</h4>
                    {description && <p className="text-xs text-slate-400">{description}</p>}
                </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={settings[settingKey] === 'true' || settings[settingKey] === true}
                    onChange={(e) => handleChange(settingKey, String(e.target.checked))}
                    className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>
    );

    const uploadSizes = [
        { value: '2', label: '2 MB' },
        { value: '5', label: '5 MB' },
        { value: '10', label: '10 MB' },
        { value: '25', label: '25 MB' },
        { value: '50', label: '50 MB' },
        { value: '100', label: '100 MB' },
    ];

    const compressionLevels = [
        { value: 'none', label: 'No Compression', desc: 'Original quality' },
        { value: 'low', label: 'Low', desc: '90% quality' },
        { value: 'medium', label: 'Medium', desc: '80% quality' },
        { value: 'high', label: 'High', desc: '60% quality' },
    ];

    const storageOptions = [
        { value: 'local', label: 'Local Storage', desc: 'Store on server', icon: HardDrive },
        { value: 's3', label: 'Amazon S3', desc: 'Cloud storage', icon: Layers },
        { value: 'cloudinary', label: 'Cloudinary', desc: 'Image CDN', icon: Zap },
    ];

    const thumbnailSizes = [
        { id: 'small', width: 150, height: 150, label: 'Small Thumbnail' },
        { id: 'medium', width: 300, height: 300, label: 'Medium Thumbnail' },
        { id: 'large', width: 600, height: 600, label: 'Large Thumbnail' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Upload Settings */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Upload className="text-blue-500" size={20} /> Upload Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Max Upload Size</label>
                        <select
                            value={settings.max_upload_size || '10'}
                            onChange={(e) => handleChange('max_upload_size', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            {uploadSizes.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Max Dimension (px)</label>
                        <input
                            type="number"
                            value={settings.max_image_dimension || '2048'}
                            onChange={(e) => handleChange('max_image_dimension', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                            placeholder="2048"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Allowed File Extensions</label>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf', 'mp4', 'mp3', 'zip'].map(ext => {
                            const isEnabled = (settings.allowed_extensions || 'jpg,jpeg,png,gif,webp,svg,pdf').includes(ext);
                            return (
                                <label
                                    key={ext}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition ${isEnabled
                                            ? 'border-green-300 bg-green-50 text-green-700'
                                            : 'border-slate-200 bg-slate-50 text-slate-500'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isEnabled}
                                        onChange={(e) => {
                                            const current = (settings.allowed_extensions || 'jpg,jpeg,png,gif,webp,svg,pdf').split(',');
                                            if (e.target.checked) {
                                                handleChange('allowed_extensions', [...current, ext].join(','));
                                            } else {
                                                handleChange('allowed_extensions', current.filter(e => e !== ext).join(','));
                                            }
                                        }}
                                        className="w-4 h-4 accent-green-600"
                                    />
                                    <span className="text-sm font-medium">.{ext}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Image Optimization */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Zap className="text-amber-500" size={20} /> Image Optimization
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <ToggleSwitch label="Auto Compression" description="Compress images on upload" settingKey="auto_compression" icon={Zap} />
                    <ToggleSwitch label="Convert to WebP" description="Convert images to WebP format" settingKey="convert_to_webp" icon={Image} />
                    <ToggleSwitch label="Strip EXIF Data" description="Remove metadata from images" settingKey="strip_exif" icon={Settings} />
                    <ToggleSwitch label="Lazy Loading" description="Enable lazy loading for images" settingKey="lazy_loading" icon={Layers} />
                </div>

                <div>
                    <label className="block text-slate-600 text-xs font-bold uppercase mb-3">Compression Level</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {compressionLevels.map(level => (
                            <button
                                key={level.value}
                                onClick={() => handleChange('compression_level', level.value)}
                                className={`p-4 rounded-xl border-2 text-center transition ${settings.compression_level === level.value
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                            >
                                <span className="text-sm font-bold">{level.label}</span>
                                <p className="text-xs text-slate-400 mt-1">{level.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Thumbnail Generation */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Crop className="text-purple-500" size={20} /> Thumbnail Generation
                </h3>

                <ToggleSwitch
                    label="Auto Generate Thumbnails"
                    description="Create multiple sizes on upload"
                    settingKey="auto_thumbnails"
                    icon={Crop}
                />

                <div className="mt-6">
                    <label className="block text-slate-600 text-xs font-bold uppercase mb-3">Thumbnail Sizes</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {thumbnailSizes.map(size => (
                            <div
                                key={size.id}
                                className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-medium text-slate-700">{size.label}</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings[`thumb_${size.id}_enabled`] !== 'false'}
                                            onChange={(e) => handleChange(`thumb_${size.id}_enabled`, String(e.target.checked))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-slate-500">Width</label>
                                        <input
                                            type="number"
                                            value={settings[`thumb_${size.id}_width`] || size.width}
                                            onChange={(e) => handleChange(`thumb_${size.id}_width`, e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500">Height</label>
                                        <input
                                            type="number"
                                            value={settings[`thumb_${size.id}_height`] || size.height}
                                            onChange={(e) => handleChange(`thumb_${size.id}_height`, e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Storage Provider */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <HardDrive className="text-green-500" size={20} /> Storage Provider
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {storageOptions.map(option => (
                        <button
                            key={option.value}
                            onClick={() => handleChange('storage_provider', option.value)}
                            className={`p-5 rounded-xl border-2 text-left transition ${settings.storage_provider === option.value
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <option.icon size={28} className={settings.storage_provider === option.value ? 'text-blue-600' : 'text-slate-400'} />
                            <h4 className="font-bold text-slate-800 mt-3">{option.label}</h4>
                            <p className="text-xs text-slate-500">{option.desc}</p>
                        </button>
                    ))}
                </div>

                {/* S3 Configuration */}
                {settings.storage_provider === 's3' && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <h4 className="font-bold text-amber-800 mb-3">S3 Configuration</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-600 font-medium">Access Key ID</label>
                                <input
                                    type="text"
                                    value={settings.s3_access_key || ''}
                                    onChange={(e) => handleChange('s3_access_key', e.target.value)}
                                    className="w-full bg-white border border-amber-300 rounded-lg p-2.5 text-sm mt-1"
                                    placeholder="AKIAIOSFODNN7EXAMPLE"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-600 font-medium">Secret Access Key</label>
                                <input
                                    type="password"
                                    value={settings.s3_secret_key || ''}
                                    onChange={(e) => handleChange('s3_secret_key', e.target.value)}
                                    className="w-full bg-white border border-amber-300 rounded-lg p-2.5 text-sm mt-1"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-600 font-medium">Bucket Name</label>
                                <input
                                    type="text"
                                    value={settings.s3_bucket || ''}
                                    onChange={(e) => handleChange('s3_bucket', e.target.value)}
                                    className="w-full bg-white border border-amber-300 rounded-lg p-2.5 text-sm mt-1"
                                    placeholder="my-bucket"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-600 font-medium">Region</label>
                                <input
                                    type="text"
                                    value={settings.s3_region || ''}
                                    onChange={(e) => handleChange('s3_region', e.target.value)}
                                    className="w-full bg-white border border-amber-300 rounded-lg p-2.5 text-sm mt-1"
                                    placeholder="us-east-1"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Cloudinary Configuration */}
                {settings.storage_provider === 'cloudinary' && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                        <h4 className="font-bold text-purple-800 mb-3">Cloudinary Configuration</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs text-slate-600 font-medium">Cloud Name</label>
                                <input
                                    type="text"
                                    value={settings.cloudinary_cloud_name || ''}
                                    onChange={(e) => handleChange('cloudinary_cloud_name', e.target.value)}
                                    className="w-full bg-white border border-purple-300 rounded-lg p-2.5 text-sm mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-600 font-medium">API Key</label>
                                <input
                                    type="text"
                                    value={settings.cloudinary_api_key || ''}
                                    onChange={(e) => handleChange('cloudinary_api_key', e.target.value)}
                                    className="w-full bg-white border border-purple-300 rounded-lg p-2.5 text-sm mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-600 font-medium">API Secret</label>
                                <input
                                    type="password"
                                    value={settings.cloudinary_api_secret || ''}
                                    onChange={(e) => handleChange('cloudinary_api_secret', e.target.value)}
                                    className="w-full bg-white border border-purple-300 rounded-lg p-2.5 text-sm mt-1"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default MediaSettings;
