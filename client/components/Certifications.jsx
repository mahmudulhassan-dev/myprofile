import React from 'react';
import { certifications } from '../data/certifications';
import { Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Certifications = () => {
    const { t, getContent } = useLanguage();

    return (
        <section className="py-20 bg-white/50 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">{t('certifications')}</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {certifications.map(cert => (
                        <div key={cert.id} className="bg-white p-6 rounded-2xl text-center border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="mx-auto bg-purple-50 w-14 h-14 rounded-full flex items-center justify-center text-primary-purple mb-4">
                                <Award size={28} />
                            </div>
                            <h3 className="text-slate-800 font-bold mb-2 text-sm">{getContent(cert, 'title')}</h3>
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">{cert.issuer}, {cert.year}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Certifications;
