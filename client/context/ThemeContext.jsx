import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Modes: 'light', 'dark', 'aurora'
    const [theme, setTheme] = useState(localStorage.getItem('amanaflow_theme') || 'light');

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark', 'aurora');
        root.classList.add(theme);
        localStorage.setItem('amanaflow_theme', theme);

        // Apply global CSS variables based on theme
        if (theme === 'dark') {
            root.style.setProperty('--bg-primary', '#0f172a');
            root.style.setProperty('--text-primary', '#f8fafc');
        } else if (theme === 'aurora') {
            root.style.setProperty('--bg-primary', '#020617');
            root.style.setProperty('--text-primary', '#f8fafc');
        } else {
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--text-primary', '#0f172a');
        }
    }, [theme]);

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};
