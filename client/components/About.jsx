import React from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data/profile';
import { Building2, Globe2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
    const { t, getContent } = useLanguage();

    return (
        <section id="about" className="py-24 relative">
            {/* Decorator */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-aurora-blue/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 gap-16 items-center"
                >
                    <div>
                        <span className="text-primary-purple font-semibold tracking-wider text-sm uppercase">About Me</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-2 mb-8 animate-gradient-text">{t('about_me')}</h2>
                        <p className="text-lg text-slate-600 leading-relaxed mb-8 font-light">
                            {getContent(profile, 'bio')}
                        </p>

                        {/* Simple Stats or decorative line */}
                        <div className="h-1 w-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                    </div>

                    <div className="grid gap-6">
                        {profile.companies.map((company, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                className="glass-card p-6 rounded-2xl hover:shadow-2xl hover:shadow-purple-500/10 transition duration-300 cursor-pointer border-transparent bg-white/80"
                            >
                                <div className="flex items-center gap-5 mb-3">
                                    <div className="p-3 bg-indigo-50 rounded-xl text-primary-purple">
                                        <Building2 size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">{company.name}</h3>
                                        <span className="text-sm text-indigo-500 font-semibold uppercase">{getContent(company, 'role')}</span>
                                    </div>
                                </div>
                                <p className="text-slate-500 text-sm mt-2 leading-relaxed">{getContent(company, 'description')}</p>
                                {company.url !== '#' && (
                                    <a href={company.url} target="_blank" rel="noreferrer" className="text-primary-purple hover:text-pink-600 hover:underline text-sm mt-4 inline-flex items-center gap-1 font-medium">
                                        <Globe2 size={14} /> {t('visit_website')}
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
