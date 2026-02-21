import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Menu, X, Globe, User, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import CurrencyToggle from './common/CurrencyToggle';
import ThemeToggle from './common/ThemeToggle';
import LanguageSwitcher from './common/LanguageSwitcher';
import NotificationCenter from './common/NotificationCenter';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { language, changeLanguage, availableLanguages } = useLanguage();
    const { settings: globalSettings } = useSettings();

    // Header specific state
    const [headerSettings, setHeaderSettings] = useState({});
    const [menuItems, setMenuItems] = useState([]);

    const fetchHeaderData = async () => {
        try {
            const res = await fetch('/api/header');
            const data = await res.json();
            setHeaderSettings(data.settings || {});
            setMenuItems(data.menu || []);
        } catch (error) {
            console.error('Failed to load header', error);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        fetchHeaderData();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Helper to render link items
    const renderLink = (item, isMobile = false) => {
        const isScrollLink = item.url.startsWith('#');
        const commonClasses = isMobile
            ? "block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-primary-purple hover:bg-purple-50 cursor-pointer text-center"
            : "px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-primary-purple hover:bg-purple-50/50 transition cursor-pointer flex items-center gap-1";

        if (isScrollLink) {
            return (
                <ScrollLink
                    key={item.id}
                    to={item.url.substring(1)}
                    spy={true}
                    smooth={true}
                    offset={-80}
                    duration={500}
                    activeClass="text-primary-purple bg-purple-50"
                    className={commonClasses}
                    onClick={() => isMobile && setIsOpen(false)}
                >
                    {item.icon && <i className={item.icon}></i>} {item.title}
                </ScrollLink>
            );
        }

        return (
            <a
                key={item.id}
                href={item.url}
                target={item.isOpenNewTab ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className={commonClasses}
                onClick={() => isMobile && setIsOpen(false)}
            >
                {item.icon && <i className={item.icon}></i>} {item.title}
            </a>
        );
    };

    // Filter top level items
    const topLevelItems = menuItems.filter(item => !item.parentId);

    // Style adjustments
    const headerBg = scrolled
        ? (headerSettings.header_bg_color || 'white')
        : (headerSettings.header_transparent === 'true' ? 'transparent' : (headerSettings.header_bg_color || 'white'));

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'shadow-sm border-b border-white/20' : ''}`}
            style={{ backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.9)' : headerBg }} // Fallback to semi-transparent white on scroll if custom color not set perfectly
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 cursor-pointer">
                        <a href="/" className="flex items-center gap-2">
                            {headerSettings.logo_url ? (
                                <img
                                    src={headerSettings.logo_url}
                                    alt={headerSettings.logo_alt || globalSettings?.site_title}
                                    style={{
                                        width: headerSettings.logo_width ? `${headerSettings.logo_width}px` : 'auto',
                                        height: headerSettings.logo_height ? `${headerSettings.logo_height}px` : '40px'
                                    }}
                                    className="object-contain"
                                />
                            ) : (
                                <span className="text-2xl font-bold bg-gradient-to-r from-primary-purple to-aurora-blue bg-clip-text text-transparent">
                                    {globalSettings?.site_title || 'MH.'}
                                </span>
                            )}
                        </a>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-8">
                        <div className="flex items-center space-x-1">
                            {topLevelItems.map((item) => {
                                const subItems = menuItems.filter(sub => sub.parentId === item.id);
                                if (subItems.length > 0) {
                                    return (
                                        <div key={item.id} className="relative group">
                                            <button className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-primary-purple hover:bg-purple-50/50 transition cursor-pointer flex items-center gap-1">
                                                {item.title} <ChevronDown size={14} />
                                            </button>
                                            <div className="absolute top-full left-0 w-48 bg-white border border-slate-100 shadow-lg rounded-xl overflow-hidden hidden group-hover:block pt-2 animate-fade-in-up">
                                                {subItems.map(sub => (
                                                    <a
                                                        key={sub.id}
                                                        href={sub.url}
                                                        target={sub.isOpenNewTab ? '_blank' : '_self'}
                                                        className="block px-4 py-2 text-sm text-slate-600 hover:bg-purple-50 hover:text-primary-purple"
                                                    >
                                                        {sub.title}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }
                                return renderLink(item);
                            })}
                            <a href="/client-portal" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-all px-4 py-2 rounded-xl hover:bg-slate-50">Portal</a>
                        </div>

                        <div className="flex items-center gap-3">
                            <CurrencyToggle />
                            <NotificationCenter />
                            <LanguageSwitcher />
                            <ThemeToggle />

                            {headerSettings.header_cta_enabled === 'true' && (
                                <a
                                    href={headerSettings.header_cta_url || '/login'}
                                    style={{
                                        backgroundColor: headerSettings.header_cta_bg || '#0f172a',
                                        color: headerSettings.header_cta_text_color || '#ffffff'
                                    }}
                                    className="flex items-center gap-2 px-5 py-2 rounded-full font-medium text-sm hover:opacity-90 transition-colors shadow-lg shadow-purple-500/20"
                                >
                                    <User size={16} /> {headerSettings.header_cta_text || 'Login'}
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="-mr-2 flex lg:hidden items-center gap-4">
                        <CurrencyToggle />
                        <button
                            onClick={() => {
                                // Cycle through languages
                                const currentIndex = availableLanguages.findIndex(l => l.code === language);
                                const nextIndex = (currentIndex + 1) % availableLanguages.length;
                                changeLanguage(availableLanguages[nextIndex].code);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white/50 text-slate-600 hover:text-primary-purple transition-all"
                        >
                            <span className="text-lg">{availableLanguages?.find(l => l.code === language)?.flag}</span>
                            <span className="text-xs font-bold uppercase">{language}</span>
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
                        {topLevelItems.map((item) => {
                            const subItems = menuItems.filter(sub => sub.parentId === item.id);
                            if (subItems.length > 0) {
                                return (
                                    <div key={item.id}>
                                        <div className="px-3 py-2 text-base font-bold text-slate-800 text-center">{item.title}</div>
                                        <div className="space-y-1 pl-4 border-l-2 border-slate-100 ml-4">
                                            {subItems.map(sub => (
                                                <a
                                                    key={sub.id}
                                                    href={sub.url}
                                                    className="block px-3 py-2 text-sm text-slate-600 hover:text-primary-purple block"
                                                >
                                                    {sub.title}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }
                            return renderLink(item, true);
                        })}

                        {headerSettings.header_cta_enabled === 'true' && (
                            <a
                                href={headerSettings.header_cta_url || '/login'}
                                style={{
                                    backgroundColor: headerSettings.header_cta_bg || '#0f172a',
                                    color: headerSettings.header_cta_text_color || '#ffffff'
                                }}
                                className="block w-full text-center px-3 py-3 rounded-md text-base font-bold mt-4"
                            >
                                {headerSettings.header_cta_text || 'Login'}
                            </a>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
