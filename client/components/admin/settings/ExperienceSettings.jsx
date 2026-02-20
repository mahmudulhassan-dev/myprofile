import React from 'react';
import { Sparkles, Cookie, FileText, Loader2, ArrowUp, Zap, MousePointer, Shield, Eye } from 'lucide-react';

const ExperienceSettings = ({ settings, handleChange }) => {

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

    const preloaderStyles = [
        { value: 'spinner', label: 'Spinner', preview: '⏳' },
        { value: 'dots', label: 'Dots', preview: '● ● ●' },
        { value: 'bars', label: 'Bars', preview: '▌▌▌' },
        { value: 'pulse', label: 'Pulse', preview: '◉' },
        { value: 'logo', label: 'Logo Fade', preview: '🎨' },
        { value: 'progress', label: 'Progress Bar', preview: '▓▓▓░░' },
    ];

    const animationStyles = [
        { value: 'none', label: 'No Animations' },
        { value: 'subtle', label: 'Subtle (Recommended)' },
        { value: 'moderate', label: 'Moderate' },
        { value: 'full', label: 'Full Animations' },
    ];

    const cookiePositions = [
        { value: 'bottom', label: 'Bottom Bar' },
        { value: 'bottom-left', label: 'Bottom Left Corner' },
        { value: 'bottom-right', label: 'Bottom Right Corner' },
        { value: 'top', label: 'Top Bar' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Cookie Consent */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Cookie className="text-amber-500" size={20} /> Cookie Consent
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <ToggleSwitch
                        label="Enable Cookie Banner"
                        description="Show cookie consent popup to visitors"
                        settingKey="cookie_consent_enabled"
                        icon={Cookie}
                    />
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Banner Position</label>
                        <select
                            value={settings.cookie_position || 'bottom'}
                            onChange={(e) => handleChange('cookie_position', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            {cookiePositions.map(p => (
                                <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Cookie Message</label>
                        <textarea
                            value={settings.cookie_message || 'We use cookies to enhance your experience. By continuing, you agree to our use of cookies.'}
                            onChange={(e) => handleChange('cookie_message', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm h-24"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Accept Button Text</label>
                        <input
                            type="text"
                            value={settings.cookie_accept_text || 'Accept All'}
                            onChange={(e) => handleChange('cookie_accept_text', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm mb-3"
                        />
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Decline Button Text</label>
                        <input
                            type="text"
                            value={settings.cookie_decline_text || 'Decline'}
                            onChange={(e) => handleChange('cookie_decline_text', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        />
                    </div>
                </div>
            </section>

            {/* GDPR */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Shield className="text-blue-500" size={20} /> GDPR Compliance
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ToggleSwitch label="Enable GDPR Mode" description="Comply with EU data protection laws" settingKey="gdpr_enabled" icon={Shield} />
                    <ToggleSwitch label="Data Export Request" description="Allow users to request their data" settingKey="gdpr_data_export" icon={FileText} />
                    <ToggleSwitch label="Data Deletion Request" description="Allow users to request data deletion" settingKey="gdpr_data_deletion" icon={FileText} />
                    <ToggleSwitch label="Consent Logging" description="Log user consent choices" settingKey="gdpr_consent_log" icon={Eye} />
                </div>

                <div className="mt-6">
                    <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Privacy Policy URL</label>
                    <input
                        type="url"
                        value={settings.privacy_policy_url || '/privacy-policy'}
                        onChange={(e) => handleChange('privacy_policy_url', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        placeholder="https://yoursite.com/privacy-policy"
                    />
                </div>
            </section>

            {/* Preloader */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Loader2 className="text-purple-500" size={20} /> Preloader
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <ToggleSwitch label="Enable Preloader" description="Show loading animation on initial page load" settingKey="preloader_enabled" icon={Loader2} />
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Preloader Duration (ms)</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="500"
                                max="3000"
                                step="250"
                                value={settings.preloader_duration || 1000}
                                onChange={(e) => handleChange('preloader_duration', e.target.value)}
                                className="flex-1 accent-blue-600"
                            />
                            <span className="text-sm font-mono text-slate-600 w-16 text-right">{settings.preloader_duration || 1000}ms</span>
                        </div>
                    </div>
                </div>

                <label className="block text-slate-600 text-xs font-bold uppercase mb-3">Preloader Style</label>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                    {preloaderStyles.map(style => (
                        <button
                            key={style.value}
                            onClick={() => handleChange('preloader_style', style.value)}
                            className={`p-4 rounded-xl border-2 text-center transition ${settings.preloader_style === style.value
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <div className="text-2xl mb-2">{style.preview}</div>
                            <span className="text-xs font-medium text-slate-700">{style.label}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Scroll to Top */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <ArrowUp className="text-green-500" size={20} /> Scroll to Top
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <ToggleSwitch label="Enable Scroll-to-Top Button" description="Show floating back-to-top button" settingKey="scroll_to_top_enabled" icon={ArrowUp} />
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Show After (pixels)</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="100"
                                max="1000"
                                step="100"
                                value={settings.scroll_to_top_offset || 300}
                                onChange={(e) => handleChange('scroll_to_top_offset', e.target.value)}
                                className="flex-1 accent-blue-600"
                            />
                            <span className="text-sm font-mono text-slate-600 w-16 text-right">{settings.scroll_to_top_offset || 300}px</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Button Position</label>
                        <select
                            value={settings.scroll_to_top_position || 'bottom-right'}
                            onChange={(e) => handleChange('scroll_to_top_position', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            <option value="bottom-right">Bottom Right</option>
                            <option value="bottom-left">Bottom Left</option>
                            <option value="bottom-center">Bottom Center</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Button Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={settings.scroll_to_top_color || '#3b82f6'}
                                onChange={(e) => handleChange('scroll_to_top_color', e.target.value)}
                                className="h-10 w-10 rounded cursor-pointer border-0"
                            />
                            <input
                                type="text"
                                value={settings.scroll_to_top_color || '#3b82f6'}
                                onChange={(e) => handleChange('scroll_to_top_color', e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 w-full text-sm font-mono"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Animations */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Sparkles className="text-pink-500" size={20} /> Animations
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <ToggleSwitch label="Enable Page Animations" description="Smooth transitions and effects" settingKey="animations_enabled" icon={Sparkles} />
                    <ToggleSwitch label="Reduce Animations" description="Respect user's reduced motion preference" settingKey="respect_reduced_motion" icon={MousePointer} />
                </div>

                <div>
                    <label className="block text-slate-600 text-xs font-bold uppercase mb-3">Animation Intensity</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {animationStyles.map(style => (
                            <button
                                key={style.value}
                                onClick={() => handleChange('animation_level', style.value)}
                                className={`p-4 rounded-xl border-2 text-center transition ${settings.animation_level === style.value
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                            >
                                <Zap size={20} className="mx-auto mb-2" />
                                <span className="text-sm font-medium">{style.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cursor Effects */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <MousePointer className="text-indigo-500" size={20} /> Cursor & Hover Effects
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ToggleSwitch label="Custom Cursor" description="Use a custom cursor design" settingKey="custom_cursor_enabled" icon={MousePointer} />
                    <ToggleSwitch label="Hover Glow Effects" description="Add glow effect on hover" settingKey="hover_glow_enabled" icon={Sparkles} />
                    <ToggleSwitch label="Smooth Scroll" description="Enable smooth scrolling behavior" settingKey="smooth_scroll_enabled" icon={ArrowUp} />
                    <ToggleSwitch label="Parallax Effects" description="Enable parallax scrolling for images" settingKey="parallax_enabled" icon={Zap} />
                </div>
            </section>
        </div>
    );
};

export default ExperienceSettings;
