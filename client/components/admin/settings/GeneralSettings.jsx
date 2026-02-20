import React from 'react';
import {
    Globe, Clock, MapPin, Mail, Phone, Building, Image, Share2
} from 'lucide-react';

const GeneralSettings = ({ settings, handleChange, handleFileUpload }) => {

    const FileUploadBox = ({ label, id, accept = "image/*", size = "normal" }) => (
        <div className={`border border-dashed border-slate-300 rounded-xl ${size === 'small' ? 'p-4' : 'p-6'} text-center hover:bg-slate-50 transition relative group bg-white`}>
            {settings[id] ? (
                <div className="relative inline-block">
                    <img src={settings[id]} alt="Preview" className={`${size === 'small' ? 'h-10' : 'h-16'} mx-auto object-contain mb-2`} />
                    <button onClick={() => handleChange(id, '')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition">✕</button>
                </div>
            ) : (
                <div className={`${size === 'small' ? 'h-10 w-10' : 'h-16 w-16'} bg-slate-100 rounded-full mx-auto mb-2 flex items-center justify-center text-slate-400`}>
                    <Image size={size === 'small' ? 16 : 24} />
                </div>
            )}
            <p className="text-sm font-medium text-slate-700 mb-1">{label}</p>
            <input type="file" accept={accept} className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, id)} />
            <span className="text-xs text-blue-500 font-bold">Click to Upload</span>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Website Identity */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Globe className="text-blue-500" size={20} /> Website Identity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Website Name</label>
                        <input
                            value={settings.site_title || ''}
                            onChange={(e) => handleChange('site_title', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none transition"
                            placeholder="My Awesome Website"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Tagline</label>
                        <input
                            value={settings.site_tagline || ''}
                            onChange={(e) => handleChange('site_tagline', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none transition"
                            placeholder="Innovate. Create. Inspire."
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Default Country</label>
                        <select
                            value={settings.default_country || 'BD'}
                            onChange={(e) => handleChange('default_country', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none cursor-pointer"
                        >
                            <option value="BD">🇧🇩 Bangladesh</option>
                            <option value="US">🇺🇸 United States</option>
                            <option value="GB">🇬🇧 United Kingdom</option>
                            <option value="CA">🇨🇦 Canada</option>
                            <option value="AU">🇦🇺 Australia</option>
                            <option value="IN">🇮🇳 India</option>
                            <option value="AE">🇦🇪 UAE</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Default Currency</label>
                        <select
                            value={settings.default_currency || 'BDT'}
                            onChange={(e) => handleChange('default_currency', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none cursor-pointer"
                        >
                            <option value="BDT">৳ BDT (Bangladeshi Taka)</option>
                            <option value="USD">$ USD (US Dollar)</option>
                            <option value="EUR">€ EUR (Euro)</option>
                            <option value="GBP">£ GBP (British Pound)</option>
                            <option value="INR">₹ INR (Indian Rupee)</option>
                        </select>
                    </div>
                </div>
                <div className="mt-6">
                    <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Website Description</label>
                    <textarea
                        value={settings.site_description || ''}
                        onChange={(e) => handleChange('site_description', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none transition h-24 resize-none"
                        placeholder="A brief description of your website for search engines and social sharing."
                    />
                </div>
            </section>

            {/* Contact Information */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Mail className="text-green-500" size={20} /> Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Support Email</label>
                        <input
                            type="email"
                            value={settings.support_email || ''}
                            onChange={(e) => handleChange('support_email', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none transition"
                            placeholder="support@yoursite.com"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Admin Email</label>
                        <input
                            type="email"
                            value={settings.admin_email || ''}
                            onChange={(e) => handleChange('admin_email', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none transition"
                            placeholder="admin@yoursite.com"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Phone Number</label>
                        <input
                            type="tel"
                            value={settings.contact_phone || ''}
                            onChange={(e) => handleChange('contact_phone', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none transition"
                            placeholder="+880 1XXX-XXXXXX"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Business Address</label>
                        <input
                            value={settings.business_address || ''}
                            onChange={(e) => handleChange('business_address', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none transition"
                            placeholder="123 Main Street, City, Country"
                        />
                    </div>
                </div>
            </section>

            {/* Favicon & Social Images */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Image className="text-purple-500" size={20} /> Favicon & Social Images
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <FileUploadBox id="favicon" label="Favicon (32x32)" size="small" />
                    <FileUploadBox id="apple_touch_icon" label="Apple Touch (180x180)" size="small" />
                    <FileUploadBox id="og_image" label="OG Image (1200x630)" />
                    <FileUploadBox id="twitter_image" label="Twitter Card Image" />
                </div>
                <p className="text-xs text-slate-400 mt-4">📌 OG Image is used when sharing your site on Facebook, LinkedIn, and other platforms.</p>
            </section>

            {/* Social Share Metadata */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Share2 className="text-pink-500" size={20} /> Social Share Metadata
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">OG Title</label>
                        <input
                            value={settings.og_title || ''}
                            onChange={(e) => handleChange('og_title', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none transition"
                            placeholder="Your Website | Best Products Online"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">OG Type</label>
                        <select
                            value={settings.og_type || 'website'}
                            onChange={(e) => handleChange('og_type', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none cursor-pointer"
                        >
                            <option value="website">Website</option>
                            <option value="article">Article</option>
                            <option value="product">Product</option>
                            <option value="profile">Profile</option>
                        </select>
                    </div>
                </div>
                <div className="mt-6">
                    <label className="block text-slate-600 text-xs font-bold uppercase mb-2">OG Description</label>
                    <textarea
                        value={settings.og_description || ''}
                        onChange={(e) => handleChange('og_description', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none transition h-20 resize-none"
                        placeholder="A compelling description that appears when your site is shared on social media."
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Twitter Card Type</label>
                        <select
                            value={settings.twitter_card || 'summary_large_image'}
                            onChange={(e) => handleChange('twitter_card', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none cursor-pointer"
                        >
                            <option value="summary">Summary</option>
                            <option value="summary_large_image">Summary with Large Image</option>
                            <option value="player">Player</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Twitter Handle</label>
                        <input
                            value={settings.twitter_handle || ''}
                            onChange={(e) => handleChange('twitter_handle', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 focus:border-blue-500 outline-none transition"
                            placeholder="@yourhandle"
                        />
                    </div>
                </div>
            </section>

            {/* Timezone & Locale */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Clock className="text-orange-500" size={20} /> Timezone & Locale
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Timezone</label>
                        <select
                            value={settings.timezone || 'Asia/Dhaka'}
                            onChange={(e) => handleChange('timezone', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none cursor-pointer"
                        >
                            <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">America/New York (EST)</option>
                            <option value="Europe/London">Europe/London (GMT)</option>
                            <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Date Format</label>
                        <select
                            value={settings.date_format || 'DD MMM YYYY'}
                            onChange={(e) => handleChange('date_format', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none cursor-pointer"
                        >
                            <option value="DD MMM YYYY">DD MMM YYYY (06 Dec 2024)</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-06)</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY (12/06/2024)</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY (06/12/2024)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Time Format</label>
                        <select
                            value={settings.time_format || '12h'}
                            onChange={(e) => handleChange('time_format', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none cursor-pointer"
                        >
                            <option value="12h">12 Hour (02:30 PM)</option>
                            <option value="24h">24 Hour (14:30)</option>
                        </select>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GeneralSettings;
