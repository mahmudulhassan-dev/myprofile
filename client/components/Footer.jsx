import React, { useEffect, useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Facebook, Twitter, Linkedin, Github, Youtube, ArrowUp, Send, Check } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import toast from 'react-hot-toast';

const Footer = () => {
    const { settings: globalSettings } = useSettings();
    const [footerSettings, setFooterSettings] = useState({});
    const [sections, setSections] = useState([]);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        fetch('/api/footer')
            .then(res => res.json())
            .then(data => {
                setFooterSettings(data.settings || {});
                setSections(data.sections || []);
            })
            .catch(err => console.error("Footer fetch error:", err));
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;
        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, source: 'Footer' })
            });
            if (res.ok) {
                setSubscribed(true);
                toast.success('Successfully subscribed!');
                setEmail('');
            } else {
                toast.error('Subscription failed');
            }
        } catch (error) {
            toast.error('Error subscribing');
        }
    };

    const GRID_COLS = {
        '4-col': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        '3-col': 'grid-cols-1 md:grid-cols-3',
        '2-col': 'grid-cols-1 md:grid-cols-2',
        'minimal': 'grid-cols-1 text-center'
    };

    const gridClass = GRID_COLS[footerSettings.footer_layout] || GRID_COLS['4-col'];

    // Helper to render content
    const renderSectionContent = (section) => {
        if (section.type === 'text') {
            return <p className="text-sm opacity-80 leading-relaxed font-light whitespace-pre-line">{section.content}</p>;
        }
        if (section.type === 'html') {
            return <div dangerouslySetInnerHTML={{ __html: section.content }} className="prose prose-sm prose-invert" />;
        }
        if (section.type === 'links') {
            let links = [];
            try { links = JSON.parse(section.content); } catch { }
            return (
                <ul className="space-y-2 text-sm opacity-80">
                    {links.map((link, idx) => {
                        const isScroll = link.url.startsWith('#');
                        if (isScroll) {
                            return (
                                <li key={idx}>
                                    <ScrollLink to={link.url.substring(1)} smooth={true} className="hover:text-primary-blue hover:translate-x-1 transition flex items-center gap-1 cursor-pointer">
                                        {link.label}
                                    </ScrollLink>
                                </li>
                            );
                        }
                        return (
                            <li key={idx}>
                                <a href={link.url} className="hover:text-primary-blue hover:translate-x-1 transition flex items-center gap-1 block">
                                    {link.label}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            );
        }
        return null;
    };

    return (
        <footer
            className="border-t border-slate-200/10 mt-20 relative transition-colors duration-500"
            style={{
                backgroundColor: footerSettings.footer_bg_color || '#0f172a',
                color: footerSettings.footer_text_color || '#ffffff'
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Main Grid */}
                {footerSettings.footer_layout !== 'minimal' && (
                    <div className={`grid ${gridClass} gap-12 mb-12`}>
                        {/* 1. Brand / Intro Column (Usually first, hardcoded for consistency or manageable via section?) 
                            Let's append dynamic sections. If user didn't add sections, we show defaults or nothing.
                        */}

                        {/* Dynamic Sections */}
                        {sections.map(section => (
                            <div key={section.id}>
                                {section.title && <h4 className="font-bold text-lg mb-6 opacity-100 uppercase tracking-wider text-xs">{section.title}</h4>}
                                {renderSectionContent(section)}
                            </div>
                        ))}

                        {/* Newsletter Column (Optional) */}
                        {footerSettings.footer_newsletter_enabled === 'true' && (
                            <div>
                                <h4 className="font-bold text-lg mb-6 opacity-100 uppercase tracking-wider text-xs">
                                    {footerSettings.footer_newsletter_title || 'Stay Updated'}
                                </h4>
                                <p className="text-sm opacity-70 mb-4">{footerSettings.footer_newsletter_desc}</p>
                                {subscribed ? (
                                    <div className="bg-green-500/10 text-green-400 p-4 rounded-lg flex items-center gap-2 border border-green-500/20">
                                        <Check size={18} /> Subscribed!
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubscribe} className="relative">
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
                                            required
                                        />
                                        <button type="submit" className="absolute right-2 top-1.5 bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded-md transition">
                                            <Send size={16} />
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Minimal Layout Centered Content */}
                {footerSettings.footer_layout === 'minimal' && (
                    <div className="text-center space-y-6">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            {globalSettings.site_title || 'MH.'}
                        </div>
                        <div className="flex justify-center gap-6">
                            {/* Social Icons Logic reused */}
                        </div>
                    </div>
                )}

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-60">
                    <div className="text-center md:text-left">
                        {footerSettings.footer_copyright || `© ${new Date().getFullYear()} Amanaflow | Mahmudul Hassan. All rights reserved.`}
                    </div>

                    {/* Social Icons (Global) */}
                    <div className="flex gap-4">
                        {globalSettings.social_github && <a href={globalSettings.social_github} target="_blank" rel="noreferrer" className="hover:text-white transition"><Github size={18} /></a>}
                        {globalSettings.social_linkedin && <a href={globalSettings.social_linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition"><Linkedin size={18} /></a>}
                        {globalSettings.social_facebook && <a href={globalSettings.social_facebook} target="_blank" rel="noreferrer" className="hover:text-blue-500 transition"><Facebook size={18} /></a>}
                        {globalSettings.social_twitter && <a href={globalSettings.social_twitter} target="_blank" rel="noreferrer" className="hover:text-sky-400 transition"><Twitter size={18} /></a>}
                        {globalSettings.social_youtube && <a href={globalSettings.social_youtube} target="_blank" rel="noreferrer" className="hover:text-red-500 transition"><Youtube size={18} /></a>}
                    </div>

                    <button
                        onClick={scrollToTop}
                        className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition"
                        title="Back to Top"
                    >
                        <ArrowUp size={16} />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
