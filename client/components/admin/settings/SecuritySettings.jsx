import React from 'react';
import { Shield, Key, Lock, Clock, User, Image as ImageIcon, Palette, AlertTriangle } from 'lucide-react';

const SecuritySettings = ({ settings, handleChange, handleFileUpload }) => {

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

    const passwordStrengthOptions = [
        { value: 'low', label: 'Low (6+ chars)', desc: 'Minimum security' },
        { value: 'medium', label: 'Medium (8+ chars, mixed case)', desc: 'Recommended' },
        { value: 'high', label: 'High (10+ chars, special)', desc: 'Maximum security' },
    ];

    const sessionTimeouts = [
        { value: '15', label: '15 minutes' },
        { value: '30', label: '30 minutes' },
        { value: '60', label: '1 hour' },
        { value: '120', label: '2 hours' },
        { value: '480', label: '8 hours' },
        { value: '1440', label: '24 hours' },
        { value: '10080', label: '7 days' },
    ];

    const loginStyles = [
        { value: 'centered', label: 'Centered Card' },
        { value: 'split', label: 'Split Screen' },
        { value: 'full-image', label: 'Full Image BG' },
        { value: 'minimal', label: 'Minimal' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Two-Factor Authentication */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Shield className="text-green-500" size={20} /> Two-Factor Authentication
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ToggleSwitch
                        label="Enable 2FA for Admin"
                        description="Require 2FA for admin login"
                        settingKey="2fa_admin_enabled"
                        icon={Shield}
                    />
                    <ToggleSwitch
                        label="Enable 2FA for Users"
                        description="Allow users to enable 2FA"
                        settingKey="2fa_users_enabled"
                        icon={User}
                    />
                    <ToggleSwitch
                        label="Email OTP"
                        description="Send OTP via email"
                        settingKey="2fa_email_otp"
                        icon={Key}
                    />
                    <ToggleSwitch
                        label="Authenticator App"
                        description="Support Google Authenticator / Authy"
                        settingKey="2fa_authenticator"
                        icon={Lock}
                    />
                </div>
            </section>

            {/* Password Requirements */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Key className="text-purple-500" size={20} /> Password Requirements
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {passwordStrengthOptions.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => handleChange('password_strength', opt.value)}
                            className={`p-4 rounded-xl border-2 text-left transition ${settings.password_strength === opt.value
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <h4 className="font-bold text-slate-800">{opt.label}</h4>
                            <p className="text-xs text-slate-500 mt-1">{opt.desc}</p>
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ToggleSwitch label="Require Uppercase" description="At least one capital letter" settingKey="password_uppercase" />
                    <ToggleSwitch label="Require Numbers" description="At least one digit" settingKey="password_numbers" />
                    <ToggleSwitch label="Require Special Characters" description="At least one special character" settingKey="password_special" />
                    <ToggleSwitch label="Prevent Common Passwords" description="Block commonly used passwords" settingKey="password_block_common" />
                </div>
            </section>

            {/* Session & Timeout */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Clock className="text-amber-500" size={20} /> Session & Timeout
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Session Timeout</label>
                        <select
                            value={settings.session_timeout || '60'}
                            onChange={(e) => handleChange('session_timeout', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            {sessionTimeouts.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Max Login Attempts</label>
                        <select
                            value={settings.max_login_attempts || '5'}
                            onChange={(e) => handleChange('max_login_attempts', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            <option value="3">3 attempts</option>
                            <option value="5">5 attempts</option>
                            <option value="10">10 attempts</option>
                            <option value="0">Unlimited</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ToggleSwitch label="Auto Logout on Inactivity" description="Logout after session timeout" settingKey="auto_logout" icon={Clock} />
                    <ToggleSwitch label="Single Session Mode" description="Only allow one active session per user" settingKey="single_session" icon={User} />
                    <ToggleSwitch label="Remember Me Option" description="Show 'Remember Me' checkbox" settingKey="remember_me_enabled" icon={Lock} />
                    <ToggleSwitch label="Lock After Failed Attempts" description="Temporarily lock account" settingKey="lock_after_failed" icon={AlertTriangle} />
                </div>
            </section>

            {/* Login Page Customization */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Palette className="text-pink-500" size={20} /> Login Page Customization
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Login Page Style</label>
                        <select
                            value={settings.login_style || 'centered'}
                            onChange={(e) => handleChange('login_style', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            {loginStyles.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Login Background Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={settings.login_bg_color || '#1e293b'}
                                onChange={(e) => handleChange('login_bg_color', e.target.value)}
                                className="h-10 w-10 rounded cursor-pointer border-0"
                            />
                            <input
                                type="text"
                                value={settings.login_bg_color || '#1e293b'}
                                onChange={(e) => handleChange('login_bg_color', e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 w-full text-sm font-mono"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Login Background Image</label>
                        <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition relative">
                            {settings.login_bg_image ? (
                                <div className="relative">
                                    <img src={settings.login_bg_image} alt="Login BG" className="h-24 w-full object-cover rounded-lg mb-2" />
                                    <button
                                        onClick={() => handleChange('login_bg_image', '')}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                                    >✕</button>
                                </div>
                            ) : (
                                <ImageIcon size={32} className="mx-auto text-slate-300 mb-2" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => handleFileUpload(e, 'login_bg_image')}
                            />
                            <span className="text-xs text-blue-500 font-bold">Click to Upload</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Login Logo</label>
                        <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition relative">
                            {settings.login_logo ? (
                                <div className="relative inline-block">
                                    <img src={settings.login_logo} alt="Login Logo" className="h-16 object-contain mx-auto mb-2" />
                                    <button
                                        onClick={() => handleChange('login_logo', '')}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                                    >✕</button>
                                </div>
                            ) : (
                                <ImageIcon size={32} className="mx-auto text-slate-300 mb-2" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => handleFileUpload(e, 'login_logo')}
                            />
                            <span className="text-xs text-blue-500 font-bold">Click to Upload</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Login Welcome Text</label>
                        <input
                            type="text"
                            value={settings.login_welcome_text || 'Welcome Back!'}
                            onChange={(e) => handleChange('login_welcome_text', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                            placeholder="Welcome Back!"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Login Subtitle</label>
                        <input
                            type="text"
                            value={settings.login_subtitle || 'Sign in to continue'}
                            onChange={(e) => handleChange('login_subtitle', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                            placeholder="Sign in to continue"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <ToggleSwitch label="Show Social Login" description="Google, Facebook, etc." settingKey="login_social_enabled" />
                    <ToggleSwitch label="Show Forgot Password" description="Show reset password link" settingKey="login_forgot_enabled" />
                    <ToggleSwitch label="Show Register Link" description="Link to registration page" settingKey="login_register_enabled" />
                    <ToggleSwitch label="Show Terms Checkbox" description="Require terms acceptance" settingKey="login_terms_required" />
                </div>
            </section>
        </div>
    );
};

export default SecuritySettings;
