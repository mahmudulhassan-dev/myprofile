import React from 'react';
import { motion } from 'framer-motion';
import skills from '../data/skills';
import { useLanguage } from '../context/LanguageContext';

const SkillBar = ({ skill, index }) => {
    const { getContent } = useLanguage();

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white shadow-sm border border-slate-100">
                        <skill.icon size={20} color={skill.color} />
                    </div>
                    <span className="text-slate-700 font-semibold">{getContent(skill, 'title')}</span>
                </div>
                <span className="text-slate-400 text-sm font-medium">{skill.level}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1.2, delay: index * 0.1, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="h-full rounded-full relative"
                    style={{ backgroundColor: skill.color }}
                >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </motion.div>
            </div>
        </div>
    );
};

const SkillSection = () => {
    const { t } = useLanguage();

    return (
        <section id="skills" className="py-24 relative overflow-hidden">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[500px] bg-gradient-to-r from-indigo-50/50 via-purple-50/50 to-pink-50/50 -skew-y-6 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">{t('tech_arsenal')}</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                        {t('tech_desc')}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                    <div className="glass-card p-10 rounded-3xl border-white/60 bg-white/70">
                        <h3 className="text-2xl font-bold text-slate-800 mb-8 pb-4 border-b border-slate-100">{t('core_tech')}</h3>
                        {skills.slice(0, 4).map((skill, index) => (
                            <SkillBar key={skill.id} skill={skill} index={index} />
                        ))}
                    </div>

                    <div className="glass-card p-10 rounded-3xl border-white/60 bg-white/70">
                        <h3 className="text-2xl font-bold text-slate-800 mb-8 pb-4 border-b border-slate-100">{t('specialized_skills')}</h3>
                        {skills.slice(4).map((skill, index) => (
                            <SkillBar key={skill.id} skill={skill} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SkillSection;
