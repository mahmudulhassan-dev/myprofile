import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: "Hi! I'm Amanaflow AI. Ask me anything about Mahmudul's projects, skills, or experience!" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { id: Date.now(), type: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            });
            const data = await response.json();

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: data.reply || "I'm currently undergoing maintenance. Please try again later!"
            }]);
        } catch (e) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: "Sorry, I lost my connection. Mahmudul is probably updating me!"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-[350px] h-[500px] bg-white rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col overflow-hidden backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Bot size={22} className="text-white" />
                                </div>
                                <div>
                                    <h4 className="font-black text-sm tracking-tight leading-none mb-1">Amanaflow AI</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Portfolio Assistant</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform duration-300">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium leading-relaxed ${msg.type === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-none shadow-lg'
                                        : 'bg-white text-slate-700 rounded-bl-none shadow-md border border-slate-100'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-4 rounded-3xl rounded-bl-none shadow-md border border-slate-100 italic text-slate-400 text-xs flex items-center gap-2">
                                        <Loader2 size={14} className="animate-spin text-indigo-500" /> Thinking...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-100">
                            <div className="flex gap-2 bg-slate-100 p-2 rounded-2xl">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask about projects..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium px-2 text-slate-800"
                                />
                                <button
                                    onClick={handleSend}
                                    className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-slate-900 transition-colors shadow-lg"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.2)] hover:bg-indigo-600 transition-colors group"
            >
                {isOpen ? <X size={28} /> : <div className="relative"><MessageSquare size={28} /><div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full border-4 border-slate-900 group-hover:border-indigo-600"></div></div>}
            </motion.button>
        </div>
    );
};

export default AIAssistant;
