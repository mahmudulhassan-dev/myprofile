import React from 'react';
import { Palette, Image, Type, Layout, Sun, Moon, UploadCloud, Sliders } from 'lucide-react';

const BrandingSettings = ({ settings, handleChange, handleFileUpload }) => {

    const FileUploadBox = ({ label, id, accept = "image/*" }) => (
        <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition relative group bg-white">
            {settings[id] ? (
                <div className="relative inline-block">
                    <img src={settings[id]} alt="Preview" className="h-16 mx-auto object-contain mb-3" />
                    <button onClick={() => handleChange(id, '')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition">✕</button>
                </div>
            ) : (
                <div className="h-16 w-16 bg-slate-100 rounded-full mx-auto mb-3 flex items-center justify-center text-slate-400">
                    <Image size={24} />
                </div>
            )}
            <p className="text-sm font-medium text-slate-700 mb-1">{label}</p>
            <p className="text-xs text-slate-400 mb-2">PNG, JPG, SVG (Max 2MB)</p>
            <input type="file" accept={accept} className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, id)} />
            <span className="text-xs text-blue-500 font-bold bg-blue-50 px-2 py-1 rounded">Click to Upload</span>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* 2.1 Logo & Identity */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Image className="text-pink-500" size={20} /> 2.1 Logo & Identity
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <FileUploadBox id="logo_light" label="Light Logo" />
                    <FileUploadBox id="logo_dark" label="Dark Logo" />
                    <FileUploadBox id="favicon" label="Favicon (32x32)" />
                    <FileUploadBox id="app_icon" label="App Icon (512x512)" />
                </div>
            </section>

            {/* 2.2 Theme Customization */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Palette className="text-blue-500" size={20} /> 2.2 Theme Customization
                </h3>

                {/* Colors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-3">Brand Colors</label>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Primary Color</p>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={settings.primary_color || '#4f46e5'} onChange={(e) => handleChange('primary_color', e.target.value)} className="h-10 w-10 rounded cursor-pointer border-0 p-0 shadow-sm" />
                                    <input type="text" value={settings.primary_color || '#4f46e5'} onChange={(e) => handleChange('primary_color', e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 w-full text-sm font-mono" />
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Secondary Color</p>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={settings.secondary_color || '#ec4899'} onChange={(e) => handleChange('secondary_color', e.target.value)} className="h-10 w-10 rounded cursor-pointer border-0 p-0 shadow-sm" />
                                    <input type="text" value={settings.secondary_color || '#ec4899'} onChange={(e) => handleChange('secondary_color', e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 w-full text-sm font-mono" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-3">Gradient Builder</label>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <div
                                className="h-12 w-full rounded-lg mb-3 shadow-inner"
                                style={{ background: `linear-gradient(to right, ${settings.gradient_start || '#4f46e5'}, ${settings.gradient_end || '#ec4899'})` }}
                            ></div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <span className="text-xs text-slate-400">Start</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <input type="color" value={settings.gradient_start || '#4f46e5'} onChange={(e) => handleChange('gradient_start', e.target.value)} className="h-8 w-8 rounded cursor-pointer border-0" />
                                        <input type="text" value={settings.gradient_start || '#4f46e5'} onChange={(e) => handleChange('gradient_start', e.target.value)} className="bg-white border border-slate-200 rounded p-1.5 w-full text-xs font-mono" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <span className="text-xs text-slate-400">End</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <input type="color" value={settings.gradient_end || '#ec4899'} onChange={(e) => handleChange('gradient_end', e.target.value)} className="h-8 w-8 rounded cursor-pointer border-0" />
                                        <input type="text" value={settings.gradient_end || '#ec4899'} onChange={(e) => handleChange('gradient_end', e.target.value)} className="bg-white border border-slate-200 rounded p-1.5 w-full text-xs font-mono" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* UI Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-3 text-center">Border Radius</label>
                        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <span className="text-xs">More Square</span>
                            <input type="range" min="0" max="24" value={settings.border_radius || 8} onChange={(e) => handleChange('border_radius', e.target.value)} className="w-24 accent-blue-600" />
                            <span className="text-xs">More Round</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-3 text-center">Shadow Depth</label>
                        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <span className="text-xs">Flat</span>
                            <input type="range" min="0" max="5" value={settings.shadow_depth || 1} onChange={(e) => handleChange('shadow_depth', e.target.value)} className="w-24 accent-blue-600" />
                            <span className="text-xs">Deep</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-3 text-center">Typography</label>
                        <select
                            value={settings.font_family || 'Inter'}
                            onChange={(e) => handleChange('font_family', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            <option value="Inter">Inter (Modern)</option>
                            <option value="Roboto">Roboto (Classic)</option>
                            <option value="Poppins">Poppins (Geometric)</option>
                            <option value="Merriweather">Merriweather (Serif)</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-800 p-2 rounded-lg"><Moon size={20} /></div>
                        <div>
                            <h4 className="font-bold text-sm">Dark Mode</h4>
                            <p className="text-xs text-slate-400">Enable system-wide dark mode toggle for users.</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={settings.dark_mode_enabled || false} onChange={(e) => handleChange('dark_mode_enabled', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                </div>
            </section>

            {/* 2.3 Custom Codes */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Type className="text-teal-500" size={20} /> 2.3 Custom Injections
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Custom CSS</label>
                        <textarea
                            value={settings.custom_css || ''}
                            onChange={(e) => handleChange('custom_css', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-green-400 font-mono text-xs focus:border-blue-500 outline-none h-40"
                            placeholder=".my-class { color: red; }"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Custom JavaScript</label>
                        <textarea
                            value={settings.custom_js || ''}
                            onChange={(e) => handleChange('custom_js', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-yellow-400 font-mono text-xs focus:border-blue-500 outline-none h-40"
                            placeholder="console.log('Hello');"
                        />
                    </div>
                </div>
                <div className="mt-6">
                    <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Head Custom Code (Meta, Fonts, etc.)</label>
                    <textarea
                        value={settings.custom_head_code || ''}
                        onChange={(e) => handleChange('custom_head_code', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-300 font-mono text-xs focus:border-blue-500 outline-none h-24"
                        placeholder="<link rel='stylesheet' ...>"
                    />
                </div>
            </section>
        </div>
    );
};

export default BrandingSettings;
