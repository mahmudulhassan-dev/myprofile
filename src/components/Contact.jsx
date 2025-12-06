import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

const Contact = () => {
    const { t } = useLanguage();
    const { settings } = useSettings();
    const [formData, setFormData] = useState({ name: '', email: '', industry: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast.success(t('messageSent'));
            setFormData({ name: '', email: '', industry: '', message: '' });
        }, 1500);
    };

    return (
        <section id="contact" className="py-24 relative bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-16 items-center">

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

                        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase text-xs tracking-wider">Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 font-medium"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase text-xs tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 font-medium"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase text-xs tracking-wider">Industry</label>
                                <select
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-slate-600 font-medium appearance-none"
                                >
                                    <option value="" disabled>Select Industry</option>
                                    <option value="tech">Technology / Startup</option>
                                    <option value="ecommerce">E-Commerce</option>
                                    <option value="finance">Finance</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase text-xs tracking-wider">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 font-medium resize-none"
                                    placeholder="Tell me about your project..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 text-white font-bold py-5 rounded-xl hover:bg-primary-purple transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group"
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
