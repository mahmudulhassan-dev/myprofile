import React from 'react';
import { motion } from 'framer-motion';
import { testimonials } from '../data/testimonials';
import { Quote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Testimonials = () => {
    const { t, getContent } = useLanguage();

    return (
        <section id="testimonials" className="py-24 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-20">{t('client_stories')}</h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testim, i) => (
                        <motion.div
                            key={testim.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="glass-card p-10 rounded-[2rem] relative border-white/80 bg-white/40"
                        >
                            <div className="absolute -top-6 left-8 bg-gradient-to-r from-primary-purple to-pink-500 text-white p-4 rounded-xl shadow-lg shadow-purple-500/30">
                                <Quote size={24} fill="currentColor" />
                            </div>

                            <p className="text-slate-600 mb-8 mt-4 text-lg italic leading-relaxed relative z-10">"{getContent(testim, 'text')}"</p>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                                    <img src={`https://placehold.co/100/e2e8f0/64748b?text=${testim.author.charAt(0)}`} alt="User" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="text-slate-900 font-bold">{testim.author}</h4>
                                    <span className="text-primary-purple text-sm font-semibold uppercase">{getContent(testim, 'role')}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
