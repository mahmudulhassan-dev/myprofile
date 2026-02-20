import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2, ArrowRight, Paperclip, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

const Contact = () => {
    const { t } = useLanguage();
    const { settings } = useSettings();
    const [formData, setFormData] = useState({
        full_name: '', email: '', phone: '', subject: '', message: '', project_type: ''
    });
    const [attachment, setAttachment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            if (e.target.files[0].size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB");
                return;
            }
            setAttachment(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (attachment) data.append('attachment', attachment);

        try {
            const res = await fetch('/api/contact/submit', {
                method: 'POST',
                body: data
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error || 'Something went wrong');

            setSuccess(true);
            toast.success(t('messageSent') || "Message Sent Successfully!");
            setFormData({ full_name: '', email: '', phone: '', subject: '', message: '', project_type: '' });
            setAttachment(null);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-24 max-w-lg mx-auto text-center px-6"
            >
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-green-600" size={48} />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Message Received!</h2>
                <p className="text-slate-500 mb-8">Thank you for reaching out. We have received your message and will get back to you shortly.</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="text-primary-purple font-bold hover:underline"
                >
                    Send another message
                </button>
            </motion.div>
        );
    }

    return (
        <section id="contact" className="py-24 relative bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-16 items-start">

                    {/* Left Column: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-primary-purple font-bold tracking-widest text-xs uppercase bg-purple-100 px-3 py-1 rounded-full mb-4 inline-block">
                            {t('getInTouch')}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Let's Build Something <br /> <span className="text-primary-purple">Extraordinary</span></h2>
                        <p className="text-slate-500 text-lg mb-10 leading-relaxed">
                            Ready to transform your ideas into reality? Whether you need a full-stack application, business automation, or cloud infrastructure, I'm here to help.
                        </p>

                        <div className="space-y-8">
                            {settings.contact_email && (
                                <div className="flex items-start gap-5 group cursor-pointer">
                                    <div className="bg-slate-100 p-4 rounded-2xl group-hover:bg-primary-purple group-hover:text-white transition-colors duration-300">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">Email Me</h4>
                                        <p className="text-slate-500 group-hover:text-primary-purple transition-colors">{settings.contact_email}</p>
                                    </div>
                                </div>
                            )}

                            {settings.contact_phone && (
                                <div className="flex items-start gap-5 group cursor-pointer">
                                    <div className="bg-slate-100 p-4 rounded-2xl group-hover:bg-primary-purple group-hover:text-white transition-colors duration-300">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">Call Me</h4>
                                        <p className="text-slate-500 group-hover:text-primary-purple transition-colors">{settings.contact_phone}</p>
                                    </div>
                                </div>
                            )}

                            {settings.contact_address && (
                                <div className="flex items-start gap-5 group">
                                    <div className="bg-slate-100 p-4 rounded-2xl group-hover:bg-primary-purple group-hover:text-white transition-colors duration-300">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">Location</h4>
                                        <p className="text-slate-500">{settings.contact_address}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Right Column: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 relative"
                    >
                        {/* Decorative Blob */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-50 z-0"></div>

                        <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Name</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition"
                                        placeholder="+1 234..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition"
                                    placeholder="Project Inquiry"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    minLength={20}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition resize-none"
                                    placeholder="Tell me about your project..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Attachment</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label htmlFor="file-upload" className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 border-dashed rounded-xl px-4 py-3 text-slate-500 hover:bg-slate-100 transition">
                                        <Paperclip size={18} />
                                        <span className="text-sm truncate">{attachment ? attachment.name : "Upload File (Max 5MB)"}</span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-primary-purple transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        {t('sendMessage')} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
