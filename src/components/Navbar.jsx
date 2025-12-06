import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { Menu, X, Globe, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import CurrencyToggle from './common/CurrencyToggle';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { language, toggleLanguage, t } = useLanguage();
    const { settings } = useSettings();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Simplified Links
    const navLinks = [
        { name: t('home'), to: 'hero' },
        { name: "Products", to: 'products' },
        { name: t('services'), to: 'services' },
        { name: t('projects'), to: 'projects' },
        { name: t('contact'), to: 'contact' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/70 backdrop-blur-md shadow-sm border-b border-white/20' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0 cursor-pointer">
                        <Link to="hero" smooth={true} duration={500} className="text-2xl font-bold bg-gradient-to-r from-primary-purple to-aurora-blue bg-clip-text text-transparent">
                            {settings?.site_title || 'MH.'}
                        </Link>
                    </div>

                    <div className="hidden lg:flex items-center gap-8">
                        <div className="flex items-baseline space-x-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    spy={true}
                                    smooth={true}
                                    offset={-80}
                                    duration={500}
                                    activeClass="text-primary-purple bg-purple-50"
                                    className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-primary-purple hover:bg-purple-50/50 transition cursor-pointer"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <CurrencyToggle />

                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white/50 text-slate-600 hover:text-primary-purple hover:border-purple-300 transition-all shadow-sm"
                            >
                                <Globe size={16} />
                                <span className="text-xs font-bold uppercase">{language === 'en' ? 'BN' : 'EN'}</span>
                            </button>

                            <a
                                href="/login"
                                className="flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900 text-white font-medium text-sm hover:bg-primary-purple transition-colors shadow-lg shadow-purple-500/20"
                            >
                                <User size={16} /> Login
                            </a>
                        </div>
                    </div>

                    <div className="-mr-2 flex lg:hidden items-center gap-4">
                        <CurrencyToggle />

                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white/50 text-slate-600 hover:text-primary-purple transition-all"
                        >
                            <span className="text-xs font-bold uppercase">{language === 'en' ? 'BN' : 'EN'}</span>
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-primary-purple hover:bg-purple-50 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 absolute w-full shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                smooth={true}
                                duration={500}
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-primary-purple hover:bg-purple-50 cursor-pointer text-center"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <a
                            href="/login"
                            className="block w-full text-center px-3 py-3 rounded-md text-base font-bold text-white bg-slate-900 mt-4"
                        >
                            Login
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
