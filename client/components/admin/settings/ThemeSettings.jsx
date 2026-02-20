import React from 'react';
import { Palette, Sun, Moon, Monitor, Sparkles, Square, Circle, Sliders } from 'lucide-react';

const ThemeSettings = ({ settings, handleChange }) => {

    const ColorPicker = ({ label, settingKey, defaultValue }) => (
        <div>
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <div className="flex items-center gap-3">
                <input
                    type="color"
                    value={settings[settingKey] || defaultValue}
                    onChange={(e) => handleChange(settingKey, e.target.value)}
                    className="h-10 w-10 rounded-lg cursor-pointer border-0 p-0 shadow-sm"
                />
                <input
                    type="text"
                    value={settings[settingKey] || defaultValue}
                    onChange={(e) => handleChange(settingKey, e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 w-full text-sm font-mono"
                />
            </div>
        </div>
    );

    const ToggleSwitch = ({ label, description, settingKey, defaultValue = false }) => (
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
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>
    );

    const themePresets = [
        { id: 'minimal', label: 'Minimal', colors: ['#ffffff', '#0f172a', '#3b82f6'] },
        { id: 'modern', label: 'Modern', colors: ['#1e293b', '#f8fafc', '#8b5cf6'] },
        { id: 'classic', label: 'Classic', colors: ['#f5f5f4', '#1c1917', '#ca8a04'] },
        { id: 'vibrant', label: 'Vibrant', colors: ['#fdf4ff', '#86198f', '#ec4899'] },
        { id: 'ocean', label: 'Ocean', colors: ['#0c4a6e', '#f0f9ff', '#06b6d4'] },
    ];

    const radiusOptions = [
        { value: '0', label: 'None', icon: <Square size={16} /> },
        { value: '4', label: 'Small', icon: <Square size={16} className="rounded-sm" /> },
        { value: '8', label: 'Medium', icon: <Square size={16} className="rounded" /> },
        { value: '12', label: 'Large', icon: <Square size={16} className="rounded-lg" /> },
        { value: '9999', label: 'Full', icon: <Circle size={16} /> },
    ];

    const buttonStyles = [
        { value: 'solid', label: 'Solid' },
        { value: 'outline', label: 'Outline' },
        { value: 'ghost', label: 'Ghost' },
        { value: 'gradient', label: 'Gradient' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Dark Mode / Light Mode */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Sun className="text-amber-500" size={20} /> Theme Mode
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {[
                        { id: 'light', icon: Sun, label: 'Light Mode', desc: 'Classic bright theme' },
                        { id: 'dark', icon: Moon, label: 'Dark Mode', desc: 'Easy on the eyes' },
                        { id: 'system', icon: Monitor, label: 'System Auto', desc: 'Match user preference' },
                    ].map(mode => (
                        <button
                            key={mode.id}
                            onClick={() => handleChange('theme_mode', mode.id)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${settings.theme_mode === mode.id
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <mode.icon size={24} className={settings.theme_mode === mode.id ? 'text-blue-600' : 'text-slate-400'} />
                            <h4 className="font-bold text-slate-800 mt-2">{mode.label}</h4>
                            <p className="text-xs text-slate-500">{mode.desc}</p>
                        </button>
                    ))}
                </div>

                <ToggleSwitch
                    label="Allow Users to Toggle Theme"
                    description="Show theme switcher in the frontend navbar"
                    settingKey="allow_user_theme_toggle"
                />
            </section>

            {/* Color Pickers */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Palette className="text-pink-500" size={20} /> Brand Colors
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ColorPicker label="Primary Color" settingKey="primary_color" defaultValue="#4f46e5" />
                    <ColorPicker label="Secondary Color" settingKey="secondary_color" defaultValue="#ec4899" />
                    <ColorPicker label="Accent Color" settingKey="accent_color" defaultValue="#06b6d4" />
                    <ColorPicker label="Success Color" settingKey="success_color" defaultValue="#10b981" />
                    <ColorPicker label="Warning Color" settingKey="warning_color" defaultValue="#f59e0b" />
                    <ColorPicker label="Danger Color" settingKey="danger_color" defaultValue="#ef4444" />
                    <ColorPicker label="Light Background" settingKey="bg_light" defaultValue="#ffffff" />
                    <ColorPicker label="Dark Background" settingKey="bg_dark" defaultValue="#0f172a" />
                </div>
            </section>

            {/* Border Radius Control */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Sliders className="text-purple-500" size={20} /> UI Controls
                </h3>

                <div className="mb-8">
                    <label className="block text-slate-600 text-xs font-bold uppercase mb-3">Global Border Radius</label>
                    <div className="flex gap-3">
                        {radiusOptions.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => handleChange('global_border_radius', opt.value)}
                                className={`flex-1 p-3 rounded-xl border-2 text-center transition ${settings.global_border_radius === opt.value
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                                    }`}
                            >
                                <div className="flex justify-center mb-2">{opt.icon}</div>
                                <span className="text-xs font-medium">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-slate-600 text-xs font-bold uppercase mb-3">Button Style</label>
                    <div className="flex gap-3">
                        {buttonStyles.map(style => (
                            <button
                                key={style.value}
                                onClick={() => handleChange('button_style', style.value)}
                                className={`flex-1 p-3 rounded-xl border-2 text-center transition ${settings.button_style === style.value
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                                    }`}
                            >
                                <span className="text-sm font-medium">{style.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Shadow Intensity</label>
                        <input
                            type="range"
                            min="0"
                            max="5"
                            value={settings.shadow_intensity || 2}
                            onChange={(e) => handleChange('shadow_intensity', e.target.value)}
                            className="w-full accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>None</span>
                            <span>Subtle</span>
                            <span>Deep</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Animation Speed</label>
                        <select
                            value={settings.animation_speed || 'normal'}
                            onChange={(e) => handleChange('animation_speed', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            <option value="none">Disabled</option>
                            <option value="slow">Slow (500ms)</option>
                            <option value="normal">Normal (300ms)</option>
                            <option value="fast">Fast (150ms)</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Theme Presets */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Sparkles className="text-yellow-500" size={20} /> Theme Presets
                </h3>
                <p className="text-sm text-slate-500 mb-4">Quick-apply a pre-designed color scheme. This will override current color settings.</p>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {themePresets.map(preset => (
                        <button
                            key={preset.id}
                            onClick={() => {
                                handleChange('theme_preset', preset.id);
                                // Apply preset colors
                                handleChange('bg_light', preset.colors[0]);
                                handleChange('primary_color', preset.colors[1]);
                                handleChange('accent_color', preset.colors[2]);
                            }}
                            className={`p-4 rounded-xl border-2 transition ${settings.theme_preset === preset.id
                                    ? 'border-blue-600 ring-2 ring-blue-200'
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <div className="flex gap-1 mb-2">
                                {preset.colors.map((color, i) => (
                                    <div
                                        key={i}
                                        className="w-6 h-6 rounded-full border border-white shadow-sm"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-medium text-slate-700">{preset.label}</span>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ThemeSettings;
