import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Loader2 } from 'lucide-react';

const DynamicPage = () => {
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPage = async () => {
            // Extract slug from URL manually since we are using simple routing in App.jsx or rely on window.location
            // For better routing use react-router-dom, but here we adapt to the existing simple structure
            const path = window.location.pathname;
            const slug = path.split('/p/')[1];

            if (!slug) {
                setError(true);
                setLoading(false);
                return;
            }

            try {
                const res = await fetch('/api/db');
                const data = await res.json();
                const foundPage = data.pages.find(p => p.slug === slug);

                if (foundPage) {
                    setPage(foundPage);
                } else {
                    setError(true);
                }
            } catch (e) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-aurora-bg">
            <Loader2 className="animate-spin text-primary-purple" size={40} />
        </div>
    );

    if (error || !page) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-aurora-bg text-slate-600">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p>Page not found</p>
            <a href="/" className="mt-6 text-primary-purple hover:underline">Go Home</a>
        </div>
    );

    return (
        <div className="min-h-screen bg-aurora-bg text-slate-800 font-sans">
            <Navbar />
            <main className="pt-32 pb-20 max-w-4xl mx-auto px-6 min-h-[60vh]">
                <h1 className="text-4xl font-bold mb-8 text-slate-900">{page.title}</h1>
                <div
                    className="prose prose-lg prose-slate max-w-none"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </main>
            <Footer />
        </div>
    );
};

export default DynamicPage;
