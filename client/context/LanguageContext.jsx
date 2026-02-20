import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');
    const [availableLanguages, setAvailableLanguages] = useState([
        { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
        { code: 'bn', name: 'Bengali', flag: '🇧🇩', dir: 'ltr' },
        { code: 'es', name: 'Spanish', flag: '🇪🇸', dir: 'ltr' },
        { code: 'ar', name: 'Arabic', flag: '🇸🇦', dir: 'rtl' }
    ]);

    useEffect(() => {
        const savedLang = localStorage.getItem('language');
        if (savedLang) {
            setLanguage(savedLang);
            updateDirection(savedLang);
        } else {
            // Optional: Auto-detect
            const browserLang = navigator.language.slice(0, 2);
            if (['bn', 'es', 'ar'].includes(browserLang)) {
                changeLanguage(browserLang);
            }
        }
    }, []);

    const updateDirection = (langCode) => {
        const lang = availableLanguages.find(l => l.code === langCode);
        if (lang) {
            document.documentElement.dir = lang.dir;
            document.documentElement.lang = lang.code;
        }
    };

    const changeLanguage = (langCode) => {
        setLanguage(langCode);
        localStorage.setItem('language', langCode);
        updateDirection(langCode);
    };

    const t = (key) => {
        return translations[language]?.[key] || key;
    };

    const getContent = (obj, field) => {
        if (!obj) return '';
        const val = obj[`${field}_${language}`];
        return val || obj[field]; // Fallback
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, availableLanguages, t, getContent }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
