import React, { useEffect, useState } from 'react';
import { Link } from 'react-scroll';
import { Facebook, Twitter, Linkedin, Github, Youtube, ArrowUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import NewsletterForm from './common/NewsletterForm';

const Footer = () => {
    const { t } = useLanguage();
    const { settings } = useSettings();
    const [footerData, setFooterData] = useState({ links: [], legalLinks: [], copyrightText: '' });

    useEffect(() => {
        fetch('/api/footer')
            .then(res => res.json())
            .then(data => setFooterData(data))
            .catch(err => console.error("Footer fetch error:", err));
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-slate-50 border-t border-slate-200 mt-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-5 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <div className="text-2xl font-bold bg-gradient-to-r from-primary-purple to-aurora-blue bg-clip-text text-transparent mb-4">
                            {settings.site_title || 'MH.'}
                        </div>
                        <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                            {settings.tagline || 'Building Digital Empires.'} <br />
                            Creating scalable, high-performance web solutions.
                        </p>
                        <div className="flex gap-4">
                            {settings.social_github && <a href={settings.social_github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 transition"><Github size={20} /></a>}
                            {settings.social_linkedin && <a href={settings.social_linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 transition"><Linkedin size={20} /></a>}
                            {settings.social_facebook && <a href={settings.social_facebook} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-500 transition"><Facebook size={20} /></a>}
                            {settings.social_youtube && <a href={settings.social_youtube} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-red-500 transition"><Youtube size={20} /></a>}
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-1">
                        <NewsletterForm source="Footer" variant="default" />
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 mb-6">Quick Links</h4>
                        <ul className="space-y-3 text-sm text-slate-500">
                            {footerData.links && footerData.links.map((link, i) => (
                                <li key={i}>
                                    <Link to={link.url} smooth={true} duration={500} className="hover:text-primary-purple cursor-pointer transition">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            {!footerData.links && (
                                <>
                                    <li><Link to="hero" smooth={true} className="hover:text-primary-purple">Home</Link></li>
                                    <li><Link to="services" smooth={true} className="hover:text-primary-purple">Services</Link></li>
                                </>
                            )}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 mb-6">Legal</h4>
                        <ul className="space-y-3 text-sm text-slate-500">
                            {footerData.legalLinks && footerData.legalLinks.map((link, i) => (
                                <li key={i}>
                                    <a href={link.url} className="hover:text-primary-purple transition">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 mb-6">Contact</h4>
                        <div className="space-y-3 text-sm text-slate-500">
                            {settings.contact_email && <p>Email: {settings.contact_email}</p>}
                            {settings.contact_phone && <p>Phone: {settings.contact_phone}</p>}
                            {settings.contact_address && <p>Address: {settings.contact_address}</p>}
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-sm text-center md:text-left">
                        {footerData.copyrightText || `© ${new Date().getFullYear()} ${settings.site_title || 'Mahmudul Hassan'}. All rights reserved.`}
                    </p>

                    <button
                        onClick={scrollToTop}
                        className="bg-slate-900 text-white p-3 rounded-full hover:bg-primary-purple transition shadow-lg"
                    >
                        <ArrowUp size={20} />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
