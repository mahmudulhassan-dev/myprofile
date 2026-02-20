import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../data/projects';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Projects = () => {
    const { t, getContent } = useLanguage();
    const [filter, setFilter] = useState('All');
    const categories = ['All', 'React', 'n8n', 'Marketing'];

    return (
        <section id="projects" className="py-24 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-purple-100/40 via-blue-100/40 to-pink-100/40 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">{t('featured_projects')}</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto mb-10 text-lg">
                        {t('projects_desc')}
                    </p>

                    {/* Clean Rounded Tabs */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm ${filter === cat
                                        ? 'bg-primary-purple text-white shadow-purple-500/20 shadow-md'
                                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                    }`}
                            >
                                {cat === 'All' ? t('all') : cat}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {projects.filter(p => filter === 'All' || p.tags.some(tag => tag.includes(filter))).map((project) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                key={project.id}
                                className="group relative bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 flex flex-col"
                            >
                                {/* Image Area */}
                                <div className="h-56 bg-slate-100 relative overflow-hidden p-2">
                                    <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center backdrop-blur-[2px]">
                                        <div className="flex gap-4">
                                            <a href={project.link} className="p-3 bg-white rounded-full text-slate-800 hover:text-primary-purple transform translate-y-4 group-hover:translate-y-0 transition duration-300 shadow-xl">
                                                <Github size={20} />
                                            </a>
                                            <a href={project.link} className="p-3 bg-white rounded-full text-slate-800 hover:text-primary-purple transform translate-y-4 group-hover:translate-y-0 transition duration-300 shadow-xl delay-75">
                                                <ExternalLink size={20} />
                                            </a>
                                        </div>
                                    </div>
                                    <img
                                        src={`https://placehold.co/600x400/f1f5f9/cbd5e1?text=${project.name.replace(' ', '+')}`}
                                        alt={project.name}
                                        className="w-full h-full object-cover rounded-[1.5rem] group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="mb-3">
                                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-primary-purple transition-colors flex items-center justify-between">
                                            {project.name}
                                            <ArrowUpRight size={18} className="text-slate-300 group-hover:text-primary-purple transition-colors" />
                                        </h3>
                                    </div>

                                    <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                                        {getContent(project, 'description')}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {project.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-purple-50 text-purple-600 text-xs rounded-full font-bold uppercase tracking-wide">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;
