import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../data/projects';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Tilt from 'react-parallax-tilt';

const Projects = () => {
    const { t, getContent } = useLanguage();
    const [filter, setFilter] = useState('All');
    const categories = ['All', 'React', 'n8n', 'Marketing'];

    return (
        <section id="projects" className="py-32 relative overflow-hidden bg-white">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-50/50 rounded-full blur-[120px] -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-indigo-600 font-black uppercase tracking-[0.2em] text-xs mb-4 block"
                    >
                        Portfolio Showcase
                    </motion.span>
                    <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter">
                        {t('featured_projects')}
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto mb-12 text-lg font-medium">
                        {t('projects_desc')}
                    </p>

                    {/* Premium Glass Tabs */}
                    <div className="flex flex-wrap justify-center gap-4 bg-slate-100/50 p-2 rounded-3xl w-fit mx-auto backdrop-blur-sm border border-slate-200/50 mb-16">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-8 py-3 rounded-2xl text-sm font-black transition-all duration-300 ${filter === cat
                                    ? 'bg-white text-indigo-600 shadow-xl shadow-indigo-500/10'
                                    : 'text-slate-500 hover:text-slate-800'
                                    }`}
                            >
                                {cat === 'All' ? t('all') : cat}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <AnimatePresence mode='popLayout'>
                        {projects.filter(p => filter === 'All' || p.tags.some(tag => tag.includes(filter))).map((project, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                key={project.id}
                            >
                                <Tilt
                                    tiltMaxAngleX={10}
                                    tiltMaxAngleY={10}
                                    perspective={1000}
                                    scale={1.02}
                                    transitionSpeed={1500}
                                    className="h-full"
                                >
                                    <div className="group relative bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col h-full">
                                        {/* Image Area */}
                                        <div className="h-64 bg-slate-100 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center backdrop-blur-[4px]">
                                                <div className="flex gap-4">
                                                    <a href={project.link} className="p-4 bg-white rounded-2xl text-slate-800 hover:bg-slate-900 hover:text-white transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 shadow-2xl">
                                                        <Github size={22} />
                                                    </a>
                                                    <a href={project.link} className="p-4 bg-white rounded-2xl text-slate-800 hover:bg-slate-900 hover:text-white transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 shadow-2xl delay-75">
                                                        <ExternalLink size={22} />
                                                    </a>
                                                </div>
                                            </div>
                                            <img
                                                src={`https://placehold.co/600x400/indigo/white?text=${project.name.replace(' ', '+')}`}
                                                alt={project.name}
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                            />
                                        </div>

                                        <div className="p-10 flex-1 flex flex-col">
                                            <div className="mb-4">
                                                <h3 className="text-2xl font-black text-slate-900 flex items-center justify-between group-hover:text-indigo-600 transition-colors">
                                                    {project.name}
                                                    <ArrowUpRight size={22} className="text-slate-300 group-hover:text-indigo-600 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                                                </h3>
                                            </div>

                                            <p className="text-slate-500 text-sm mb-8 line-clamp-3 leading-relaxed font-medium">
                                                {getContent(project, 'description')}
                                            </p>

                                            <div className="flex flex-wrap gap-2 mt-auto">
                                                {project.tags.map(tag => (
                                                    <span key={tag} className="px-4 py-1.5 bg-slate-100 text-slate-700 text-[10px] rounded-full font-black uppercase tracking-widest group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Tilt>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;

