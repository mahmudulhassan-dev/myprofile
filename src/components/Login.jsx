import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const Login = () => {
    const handleSocialLogin = (provider) => {
        // This is where real OAuth redirection would happen
        window.location.href = '/admin'; // Redirecting to admin for demo purposes
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-aurora-bg relative overflow-hidden">
            {/* Blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-aurora-purple/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-aurora-pink/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white relative"
            >
                <a href="/" className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 container-none">
                    <X size={24} />
                </a>

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                    <p className="text-slate-500">Sign in to access your account</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => handleSocialLogin('google')}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-semibold py-4 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                        Sign in with Google
                    </button>

                    <button
                        onClick={() => handleSocialLogin('facebook')}
                        className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white font-semibold py-4 rounded-xl hover:bg-[#166fe5] transition-colors shadow-sm shadow-blue-500/30"
                    >
                        <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-6 h-6 bg-white rounded-full" alt="Facebook" />
                        Sign in with Facebook
                    </button>
                </div>

                <div className="my-8 flex items-center gap-4">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <span className="text-slate-400 text-sm font-medium uppercase">Or</span>
                    <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                <form className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full bg-white/50 border border-slate-200 rounded-xl px-5 py-4 text-slate-800 focus:ring-2 focus:ring-purple-200 outline-none transition"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-white/50 border border-slate-200 rounded-xl px-5 py-4 text-slate-800 focus:ring-2 focus:ring-purple-200 outline-none transition"
                        />
                    </div>
                    <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-primary-purple transition-colors shadow-lg shadow-purple-500/20">
                        Login
                    </button>
                </form>

                <p className="text-center mt-8 text-slate-500 text-sm">
                    Don't have an account? <a href="#" className="text-primary-purple font-bold hover:underline">Sign up</a>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
