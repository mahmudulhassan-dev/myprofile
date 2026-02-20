import React from 'react';
import { Bell, Mail, Smartphone, Volume2, MessageSquare, Palette, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const NotificationSettings = ({ settings, handleChange }) => {

    // Function to play notification sound
    const playSound = (soundType, volume) => {
        try {
            const audio = new Audio();
            // Map sound types to actual sound URLs or use Web Audio API
            const soundMap = {
                pop: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a',
                ding: 'data:audio/wav;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAFAAAEsABVVVVVVVVVVVVVVVVVVVVVVVVVqqqqqq',
                chime: 'data:audio/wav;base64,UklGRj4AAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRoAAACAgICAgICAgICAgICAgICAgICAgICAgIA=',
                success: 'data:audio/wav;base64,UklGRkQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YSAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIA=',
                notification: 'data:audio/wav;base64,UklGRnoRAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU4RAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a'
            };

            audio.src = soundMap[soundType] || soundMap.pop;
            audio.volume = (volume / 100);
            audio.play().catch(err => console.log('Sound play failed:', err));
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    };

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

    const toastPositions = [
        { value: 'top-left', label: 'Top Left' },
        { value: 'top-center', label: 'Top Center' },
        { value: 'top-right', label: 'Top Right' },
        { value: 'bottom-left', label: 'Bottom Left' },
        { value: 'bottom-center', label: 'Bottom Center' },
        { value: 'bottom-right', label: 'Bottom Right' },
    ];

    const toastStyles = [
        { value: 'default', label: 'Default', bg: 'bg-white', text: 'text-slate-800' },
        { value: 'dark', label: 'Dark', bg: 'bg-slate-900', text: 'text-white' },
        { value: 'minimal', label: 'Minimal', bg: 'bg-slate-100', text: 'text-slate-800' },
        { value: 'glassmorphism', label: 'Glass', bg: 'bg-white/50 backdrop-blur-xl', text: 'text-slate-800' },
    ];

    const notificationSounds = [
        { value: 'none', label: 'No Sound' },
        { value: 'pop', label: 'Pop' },
        { value: 'ding', label: 'Ding' },
        { value: 'chime', label: 'Chime' },
        { value: 'success', label: 'Success Tone' },
        { value: 'notification', label: 'Notification' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* System Notifications */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Bell className="text-amber-500" size={20} /> System Notifications
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ToggleSwitch
                        label="Enable System Notifications"
                        description="Show in-app notifications for important events"
                        settingKey="system_notifications_enabled"
                        icon={Bell}
                    />
                    <ToggleSwitch
                        label="Email Notifications"
                        description="Send email alerts for orders, contacts, etc."
                        settingKey="email_notifications_enabled"
                        icon={Mail}
                    />
                    <ToggleSwitch
                        label="Push Notifications"
                        description="Browser push notifications (requires permission)"
                        settingKey="push_notifications_enabled"
                        icon={Smartphone}
                    />
                    <ToggleSwitch
                        label="Admin Notifications"
                        description="Show admin-only system alerts"
                        settingKey="admin_notifications_enabled"
                        icon={AlertTriangle}
                    />
                </div>
            </section>

            {/* Notification Events */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <MessageSquare className="text-blue-500" size={20} /> Notification Events
                </h3>
                <p className="text-sm text-slate-500 mb-4">Choose which events trigger notifications.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ToggleSwitch label="New Order" description="When someone places an order" settingKey="notify_new_order" />
                    <ToggleSwitch label="New Contact Message" description="When someone submits the contact form" settingKey="notify_new_contact" />
                    <ToggleSwitch label="New User Registration" description="When a new user signs up" settingKey="notify_new_user" />
                    <ToggleSwitch label="Newsletter Subscription" description="When someone subscribes" settingKey="notify_newsletter" />
                    <ToggleSwitch label="Payment Received" description="Successful payment confirmation" settingKey="notify_payment" />
                    <ToggleSwitch label="Low Stock Alert" description="When product stock is low" settingKey="notify_low_stock" />
                    <ToggleSwitch label="Failed Login Attempt" description="Security alert for failed logins" settingKey="notify_failed_login" />
                    <ToggleSwitch label="System Errors" description="Critical error notifications" settingKey="notify_system_errors" />
                </div>
            </section>

            {/* Sound Settings */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Volume2 className="text-green-500" size={20} /> Sound Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Notification Sound</label>
                        <div className="flex items-center gap-3">
                            <select
                                value={settings.notification_sound || 'pop'}
                                onChange={(e) => {
                                    handleChange('notification_sound', e.target.value);
                                    // Play sound preview
                                    if (e.target.value !== 'none' && !(settings.mute_all_sounds === 'true')) {
                                        playSound(e.target.value, settings.notification_volume || 50);
                                    }
                                }}
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                            >
                                {notificationSounds.map(sound => (
                                    <option key={sound.value} value={sound.value}>{sound.label}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => playSound(settings.notification_sound || 'pop', settings.notification_volume || 50)}
                                disabled={settings.notification_sound === 'none' || settings.mute_all_sounds === 'true'}
                                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Test Sound"
                            >
                                <Volume2 size={18} />
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Sound Volume</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={settings.notification_volume || 50}
                                onChange={(e) => handleChange('notification_volume', e.target.value)}
                                className="flex-1 accent-blue-600"
                            />
                            <span className="text-sm font-mono text-slate-600 w-12 text-right">{settings.notification_volume || 50}%</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <ToggleSwitch label="Mute All Sounds" description="Disable all notification sounds" settingKey="mute_all_sounds" icon={Volume2} />
                </div>
            </section>

            {/* Toast Style Customization */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Palette className="text-purple-500" size={20} /> Toast Style Customization
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Toast Position</label>
                        <select
                            value={settings.toast_position || 'top-right'}
                            onChange={(e) => handleChange('toast_position', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            {toastPositions.map(pos => (
                                <option key={pos.value} value={pos.value}>{pos.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Toast Duration (ms)</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="1000"
                                max="10000"
                                step="500"
                                value={settings.toast_duration || 4000}
                                onChange={(e) => handleChange('toast_duration', e.target.value)}
                                className="flex-1 accent-blue-600"
                            />
                            <span className="text-sm font-mono text-slate-600 w-16 text-right">{settings.toast_duration || 4000}ms</span>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-slate-600 text-xs font-bold uppercase mb-3">Toast Style</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {toastStyles.map(style => (
                            <button
                                key={style.value}
                                onClick={() => handleChange('toast_style', style.value)}
                                className={`p-4 rounded-xl border-2 transition ${settings.toast_style === style.value
                                    ? 'border-blue-600 ring-2 ring-blue-200'
                                    : 'border-slate-200'
                                    }`}
                            >
                                <div className={`p-3 rounded-lg ${style.bg} ${style.text} text-sm font-medium shadow-sm mb-2`}>
                                    Toast Preview
                                </div>
                                <span className="text-xs text-slate-600">{style.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Preview Toast */}
                <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="block text-slate-600 text-xs font-bold uppercase mb-3">Live Preview</label>
                    <div className="flex gap-3">
                        <div className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg shadow-lg text-sm">
                            <CheckCircle size={16} /> Success notification
                        </div>
                        <div className="flex items-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg shadow-lg text-sm">
                            <AlertTriangle size={16} /> Error notification
                        </div>
                        <div className="flex items-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg shadow-lg text-sm">
                            <Info size={16} /> Info notification
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NotificationSettings;
