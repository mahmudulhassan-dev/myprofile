import React from 'react';
import { Mail, Phone, MapPin, Server, Send } from 'lucide-react';

const ContactSettings = ({ settings, handleChange }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* 5.1 Contact Info */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Phone className="text-green-500" size={20} /> 5.1 Contact Info
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Office Address</label>
                        <textarea
                            value={settings.contact_address || ''}
                            onChange={(e) => handleChange('contact_address', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none h-24 resize-none"
                            placeholder="1234 Street Name, City, Country"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Google Map Iframe</label>
                        <textarea
                            value={settings.map_iframe || ''}
                            onChange={(e) => handleChange('map_iframe', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none h-24 resize-none"
                            placeholder="<iframe src='...'></iframe>"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Support Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                value={settings.contact_email || ''}
                                onChange={(e) => handleChange('contact_email', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-3 py-3 text-slate-700 outline-none"
                                placeholder="support@site.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Sales Email (Optional)</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                value={settings.sales_email || ''}
                                onChange={(e) => handleChange('sales_email', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-3 py-3 text-slate-700 outline-none"
                                placeholder="sales@site.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Phone / Hotline</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                value={settings.contact_phone || ''}
                                onChange={(e) => handleChange('contact_phone', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-3 py-3 text-slate-700 outline-none"
                                placeholder="+1 234 567 890"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">WhatsApp Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={16} />
                            <input
                                value={settings.social_whatsapp || ''}
                                onChange={(e) => handleChange('social_whatsapp', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-3 py-3 text-slate-700 outline-none"
                                placeholder="+1 234..."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 5.2 Contact Form System */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Send className="text-purple-500" size={20} /> 5.2 Contact Form System
                </h3>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl mb-6">
                    <div>
                        <h4 className="font-bold text-slate-700">Enable Contact Form</h4>
                        <p className="text-xs text-slate-500">Allow visitors to send messages via the website form.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={settings.contact_form_enabled !== false} onChange={(e) => handleChange('contact_form_enabled', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Auto-Reply Subject</label>
                        <input
                            value={settings.contact_auto_reply_subject || 'We received your message!'}
                            onChange={(e) => handleChange('contact_auto_reply_subject', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Spam Protection</label>
                        <select
                            value={settings.spam_protection || 'recaptcha'}
                            onChange={(e) => handleChange('spam_protection', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none cursor-pointer"
                        >
                            <option value="none">None (Not Recommended)</option>
                            <option value="recaptcha">Google reCAPTCHA v2/v3</option>
                            <option value="honeypot">Honeypot Field (Basic)</option>
                        </select>
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Auto-Reply Template</label>
                    <textarea
                        value={settings.contact_auto_reply_body || ''}
                        onChange={(e) => handleChange('contact_auto_reply_body', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none h-24 resize-none"
                        placeholder="Hi {name}, Thanks for contacting us..."
                    />
                </div>
            </section>

            {/* 5.3 SMTP */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Server className="text-orange-500" size={20} /> 5.3 SMTP Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">SMTP Host</label>
                        <input
                            value={settings.smtp_host || ''}
                            onChange={(e) => handleChange('smtp_host', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none"
                            placeholder="smtp.gmail.com"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">SMTP Port</label>
                        <input
                            value={settings.smtp_port || ''}
                            onChange={(e) => handleChange('smtp_port', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none"
                            placeholder="587 / 465"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">SMTP Username</label>
                        <input
                            value={settings.smtp_user || ''}
                            onChange={(e) => handleChange('smtp_user', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">SMTP Password</label>
                        <input
                            type="password"
                            value={settings.smtp_pass || ''}
                            onChange={(e) => handleChange('smtp_pass', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none"
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="enc" checked={settings.smtp_encryption === 'tls'} onChange={() => handleChange('smtp_encryption', 'tls')} className="text-blue-600" />
                            <span className="text-sm">TLS</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="enc" checked={settings.smtp_encryption === 'ssl'} onChange={() => handleChange('smtp_encryption', 'ssl')} className="text-blue-600" />
                            <span className="text-sm">SSL</span>
                        </label>
                    </div>
                    <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-700 transition">Test Email Connection</button>
                </div>
            </section>
        </div>
    );
};

export default ContactSettings;
