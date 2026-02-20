import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Database, Smartphone, Globe, Cloud, Zap, Shield, Search } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Services = () => {
    const { t, getContent } = useLanguage();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all data from DB on load
        fetch('/api/db')
            .then(res => res.json())
            .then(data => {
                if (data.services) setServices(data.services);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Helper to render dynamic icon
    const renderIcon = (iconName) => {
        const Icon = LucideIcons[iconName] || LucideIcons.HelpCircle;
        return <Icon size={28} strokeWidth={1.5} />;
    };

    if (loading) return null; // Or loader

    return (
        <section id="services" className="py-24 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <span className="text-primary-purple font-bold tracking-widest text-xs uppercase bg-purple-100 px-3 py-1 rounded-full">{t('what_i_offer')}</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-6 mb-6">{t('amana_services')}</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        {t('services_desc')}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-white p-8 rounded-[2rem] shadow-lg shadow-purple-900/5 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 relative overflow-hidden border border-slate-100"
                        >
                            {/* Soft Gradient Overlay on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center text-primary-purple mb-8 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                    {renderIcon(service.icon)}
                                </div>

                                <h3 className="text-2xl font-bold text-slate-800 mb-4">{service.title}</h3>
                                <p className="text-slate-500 leading-relaxed mb-8 font-light">
                                    {service.description}
                                </p>

                                <div className="flex items-center text-primary-purple font-bold text-sm tracking-wide cursor-pointer group/link">
                                    {t('learn_more')} <ArrowRight size={16} className="ml-2 group-hover/link:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {services.length === 0 && (
                        <div className="col-span-3 text-center text-slate-400 py-10">
                            No services found. Add some from the Admin Panel.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Services;
