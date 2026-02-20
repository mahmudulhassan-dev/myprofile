import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { ArrowRight, Download, Github, Linkedin, Facebook, Youtube } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

const Hero = () => {
    const { t } = useLanguage();
    const { profile, settings } = useSettings();

    // Loading state handled by App fallback primarily, but safe check here
    if (!profile) return null;

    return (
        <section id="hero" className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden bg-aurora-bg">
            {/* Dynamic Background Blobs */}
            <div
                className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-60 animate-blob mix-blend-multiply"
                style={{ backgroundColor: settings.primary_color || '#c084fc' }}
            ></div>
            <div
                className="absolute bottom-20 left-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-60 animate-blob animation-delay-2000 mix-blend-multiply"
                style={{ backgroundColor: settings.secondary_color || '#f472b6' }}
            ></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center relative z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-block px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-slate-200 text-slate-600 font-semibold mb-6 shadow-sm">
                        🚀 {t('hero_greeting') || profile.tagline || settings.tagline}
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-slate-800 leading-tight mb-6">
                        {t('hero_greeting')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-purple to-aurora-pink" style={{ backgroundImage: `linear-gradient(to right, ${settings.primary_color}, ${settings.secondary_color})` }}>
                            {profile.name}
                        </span>
                    </h1>

                    <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-lg">
                        {profile.bio || settings.site_description}
                    </p>

                    <div className="flex flex-wrap gap-4 mb-10">
                        <Link
                            to="projects"
                            smooth={true}
                            duration={500}
                            className="px-8 py-4 rounded-full bg-slate-900 text-white font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                        >
                            {t('hero_cta')} <ArrowRight size={20} />
                        </Link>

                        <a
                            href="/resume.pdf"
                            target="_blank"
                            className="px-8 py-4 rounded-full bg-white text-slate-800 font-bold border border-slate-200 flex items-center gap-2 hover:border-purple-300 hover:bg-purple-50 transition-all shadow-md hover:shadow-lg"
                        >
                            {t('hero_contact')} <Download size={20} />
                        </a>
                    </div>

                    <div className="flex items-center gap-6 text-slate-500">
                        {settings.social_github && (
                            <a href={settings.social_github} target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-transform hover:scale-110"><Github size={24} /></a>
                        )}
                        {settings.social_linkedin && (
                            <a href={settings.social_linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-transform hover:scale-110"><Linkedin size={24} /></a>
                        )}
                        {settings.social_facebook && (
                            <a href={settings.social_facebook} target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-transform hover:scale-110"><Facebook size={24} /></a>
                        )}
                        {settings.social_youtube && (
                            <a href={settings.social_youtube} target="_blank" rel="noreferrer" className="hover:text-red-600 transition-transform hover:scale-110"><Youtube size={24} /></a>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative hidden md:block"
                >
                    <div className="relative w-[450px] h-[450px] mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-200 to-pink-200 rounded-full animate-pulse blur-3xl opacity-50"></div>
                        <img
                            src={profile.image || "/profile.jpg"}
                            alt={profile.name}
                            className="w-full h-full object-cover rounded-[3rem] shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 border-8 border-white/50"
                        />
                    </div>

                    {/* Floating Stats */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute bottom-10 -left-10 bg-white/80 backdrop-blur p-4 rounded-2xl shadow-xl border border-white"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-lg text-green-600 font-bold">5+</div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase">Years Exp.</p>
                                <p className="font-bold text-slate-800">Developer</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="absolute top-10 -right-5 bg-white/80 backdrop-blur p-4 rounded-2xl shadow-xl border border-white"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg text-blue-600 font-bold">20+</div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase">Projects</p>
                                <p className="font-bold text-slate-800">Completed</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
