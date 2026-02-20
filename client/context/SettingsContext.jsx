import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({});
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Global Settings
                const settingsRes = await fetch('/api/settings');
                const settingsData = await settingsRes.json();

                // Fetch Profile Data
                const dbRes = await fetch('/api/db');
                const dbData = await dbRes.json();

                setSettings(prev => ({ ...prev, ...settingsData }));
                setProfile(dbData.profile);

                // Apply Dynamic Colors
                const root = document.documentElement;
                if (settingsData.primary_color) {
                    root.style.setProperty('--color-primary', settingsData.primary_color);
                    // Update Tailwind colors dynamically is hard without CSS vars, 
                    // so we might need to rely on style attributes or CSS variables usage in index.css
                }
            } catch (error) {
                console.error("Failed to fetch settings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, profile, loading }}>
            {children}
        </SettingsContext.Provider>
    );
};
