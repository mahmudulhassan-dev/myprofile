import React from 'react';
import { posts } from '../data/blog';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight } from 'lucide-react';

const Blog = () => {
    const { t, getContent } = useLanguage();

    return (
        <section id="blog" className="py-24 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-16">{t('latest_insights')}</h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {posts.map(post => (
                        <div key={post.id} className="group cursor-pointer">
                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
                                <div className="h-48 rounded-2xl bg-slate-100 mb-6 overflow-hidden">
                                    <img src={`https://placehold.co/600x400/f1f5f9/cbd5e1?text=Article+${post.id}`} alt="Blog" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>

                                <span className="text-primary-purple text-xs font-bold uppercase tracking-wider mb-3 block">{post.date}</span>
                                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary-purple transition-colors leading-tight">{getContent(post, 'title')}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-4">{getContent(post, 'excerpt')}</p>

                                <div className="flex items-center text-slate-400 text-sm font-semibold group-hover:text-primary-purple transition-colors">
                                    Read Article <ArrowRight size={16} className="ml-2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Blog;
