import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('language');
        if (savedLang) {
            setLanguage(savedLang);
        } else {
            // Optional: Auto-detect
            const browserLang = navigator.language.startsWith('bn') ? 'bn' : 'en';
            setLanguage(browserLang);
        }
    }, []);

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'bn' : 'en';
        setLanguage(newLang);
        localStorage.setItem('language', newLang);
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    // Helper to get bilingual field from data object
    // e.g. getField(project, 'description') returns project.description_bn if lang is 'bn'
    const getContent = (obj, field) => {
        if (!obj) return '';
        if (language === 'bn') {
            return obj[`${field}_bn`] || obj[field]; // Fallback to english if bn missing
        }
        return obj[field];
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t, getContent }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
