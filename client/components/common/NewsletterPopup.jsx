import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import NewsletterForm from './NewsletterForm';
import { AnimatePresence, motion } from 'framer-motion';

const NewsletterPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasSeen, setHasSeen] = useState(false);

    useEffect(() => {
        // Check if already seen session/local storage
        const seen = localStorage.getItem('newsletter_popup_seen');
        if (seen) {
            setHasSeen(true);
            return;
        }

        // Show after 10 seconds or scroll? Let's do timer for now
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 10000); // 10 seconds

        return () => clearTimeout(timer);
    }, []);

    const closePopup = () => {
        setIsOpen(false);
        setHasSeen(true);
        localStorage.setItem('newsletter_popup_seen', 'true');
    };

    if (hasSeen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden"
                    >
                        <button onClick={closePopup} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10 p-1 bg-white/50 rounded-full">
                            <X size={20} />
                        </button>

                        <div className="relative">
                            {/* Decorative Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 flex items-center justify-center">
                                <span className="text-white/20 text-6xl font-bold animate-pulse">NEWS</span>
                            </div>

                            <div className="p-8 -mt-10 relative">
                                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
                                    <NewsletterForm source="Popup" variant="popup" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NewsletterPopup;
