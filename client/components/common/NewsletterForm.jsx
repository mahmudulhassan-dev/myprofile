import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const NewsletterForm = ({ source = 'Footer', variant = 'default' }) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, source })
            });
            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                toast.success(data.message);
                setEmail('');
            } else {
                setStatus('error');
                toast.error(data.error || 'Subscription failed');
            }
        } catch (error) {
            setStatus('error');
            toast.error('Network error');
        }
    };

    if (status === 'success') {
        return (
            <div className={`flex flex-col items-center justify-center p-6 text-center animate-fade-in ${variant === 'popup' ? 'text-slate-800' : 'text-white'}`}>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle className="text-white" size={24} />
                </div>
                <h4 className="font-bold text-lg mb-1">Check your inbox!</h4>
                <p className={`text-sm opacity-80 ${variant === 'popup' ? 'text-slate-500' : 'text-slate-300'}`}>
                    We've sent a confirmation link to verify your email.
                </p>
                <button onClick={() => setStatus('idle')} className="mt-4 text-xs font-bold underline opacity-60 hover:opacity-100">
                    Subscribe another email
                </button>
            </div>
        );
    }

    return (
        <div className={`w-full ${variant === 'popup' ? '' : ''}`}>
            {variant !== 'minimal' && (
                <div className="mb-4">
                    <h4 className={`font-bold text-lg ${variant === 'popup' ? 'text-slate-800' : 'text-slate-100'}`}>
                        Join our Newsletter
                    </h4>
                    <p className={`text-sm mt-1 ${variant === 'popup' ? 'text-slate-500' : 'text-slate-400'}`}>
                        Get the latest updates, articles, and resources sent to your inbox weekly.
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 ${variant === 'popup' ? 'text-slate-400' : 'text-slate-500'}`} size={18} />
                    <input
                        type="email"
                        required
                        placeholder="Enter your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className={`w-full pl-10 pr-12 py-3 rounded-xl border outline-none focus:ring-2 transition text-sm ${variant === 'popup'
                                ? 'bg-slate-50 border-slate-200 focus:ring-blue-500 text-slate-800 placeholder:text-slate-400'
                                : 'bg-slate-800/50 border-slate-700 focus:ring-blue-500 text-white placeholder:text-slate-500'
                            }`}
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className={`absolute right-1.5 top-1.5 p-1.5 rounded-lg transition disabled:opacity-50 ${variant === 'popup'
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                    </button>
                </div>
                <p className={`text-[10px] mt-2 text-center opacity-60 ${variant === 'popup' ? 'text-slate-400' : 'text-slate-500'}`}>
                    We respect your privacy. Unsubscribe at any time.
                </p>
            </form>
        </div>
    );
};

export default NewsletterForm;
