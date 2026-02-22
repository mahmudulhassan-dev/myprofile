import React from 'react';
import { Link } from 'react-scroll';
import { ArrowRight, Download, Github, Linkedin, Facebook, Youtube } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import ParticleBackground from './common/ParticleBackground';

const Hero = () => {
    const { t } = useLanguage();
    const { profile, settings } = useSettings();

    if (!profile) return null;

    return (
        <section id="hero" className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden bg-slate-50">
            {/* V2.0 Particle Engine */}
            <ParticleBackground color={settings.primary_color || '#6366f1'} />

            {/* Ambient Glows */}
            <div
                className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-40 animate-blob"
                style={{ backgroundColor: settings.primary_color || '#c084fc' }}
            ></div>
            <div
                className="absolute bottom-20 left-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-40 animate-blob animation-delay-2000"
                style={{ backgroundColor: settings.secondary_color || '#f472b6' }}
            ></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center relative z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-block px-4 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/50 text-slate-700 font-bold mb-6 shadow-sm">
                        🚀 {t('hero_greeting') || profile.tagline || settings.tagline}
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter">
                        {t('hero_greeting')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 drop-shadow-sm" style={{ backgroundImage: `linear-gradient(to right, ${settings.primary_color}, ${settings.secondary_color})` }}>
                            {profile.name}
                        </span>
                    </h1>

                    <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg font-medium">
                        {profile.bio || settings.site_description}
                    </p>

                    <div className="flex flex-wrap gap-5 mb-12">
                        <Link
                            to="projects"
                            smooth={true}
                            duration={500}
                            className="px-10 py-5 rounded-full bg-slate-900 text-white font-black flex items-center gap-3 hover:bg-slate-800 transition-all shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1 cursor-pointer group"
                        >
                            {t('hero_cta')} <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <a
                            href="/resume.pdf"
                            target="_blank"
                            className="px-10 py-5 rounded-full bg-white/60 backdrop-blur-md text-slate-800 font-black border border-white flex items-center gap-3 hover:bg-white/80 transition-all shadow-xl hover:shadow-indigo-500/10"
                        >
                            {t('hero_contact')} <Download size={22} />
                        </a>
                    </div>

                    <div className="flex items-center gap-8 text-slate-400">
                        {settings.social_github && (
                            <a href={settings.social_github} target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-all hover:scale-125"><Github size={28} /></a>
                        )}
                        {settings.social_linkedin && (
                            <a href={settings.social_linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-all hover:scale-125"><Linkedin size={28} /></a>
                        )}
                        {settings.social_facebook && (
                            <a href={settings.social_facebook} target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-all hover:scale-125"><Facebook size={28} /></a>
                        )}
                        {settings.social_youtube && (
                            <a href={settings.social_youtube} target="_blank" rel="noreferrer" className="hover:text-red-600 transition-all hover:scale-125"><Youtube size={28} /></a>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative hidden md:block"
                >
                    <div className="relative group">
                        {/* Interactive Frame */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[4rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>

                        <div className="relative w-[500px] h-[580px] mx-auto overflow-hidden rounded-[4rem] shadow-[-20px_20px_60px_rgba(0,0,0,0.1)] border-[12px] border-white/80 backdrop-blur-sm">
                            <img
                                src={profile.image || "/profile.jpg"}
                                alt={profile.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>

                        {/* Floating Tech Cards (Glass) */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-6 -left-12 bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl">5+</div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Years Agency</p>
                                    <p className="font-black text-slate-900 leading-none">Experience</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-12 -right-10 bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl">🚀</div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Scale Fast</p>
                                    <p className="font-black text-slate-900 leading-none">Automation</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;

