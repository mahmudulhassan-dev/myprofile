import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { MessageCircle, X, Send, Paperclip, Minimize2, MoreVertical, ThumbsUp, ThumbsDown } from 'lucide-react';
import './widget.css'; // We will create this

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ChatWidget = ({ siteKey }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [socket, setSocket] = useState(null);
    const [sessionId, setSessionId] = useState(localStorage.getItem('chat_session_id'));
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Initialize Socket
    useEffect(() => {
        const newSocket = io(SOCKET_URL, {
            query: { sessionId: sessionId || undefined },
            transports: ['websocket']
        });

        newSocket.on('connect', () => {
            console.log('Chat Connected');
            if (!sessionId) {
                // Request new session if needed, but for now we rely on server to assign or use UUID
                // Ideally, we call API /api/chat/start to get a session ID
            }
        });

        newSocket.on('message', (msg) => {
            setMessages(prev => [...prev, msg]);
            scrollToBottom();
        });

        newSocket.on('typing', (data) => {
            if (data.sender === 'ai' || data.sender === 'agent') {
                setIsTyping(data.isTyping);
                scrollToBottom();
            }
        });

        setSocket(newSocket);

        return () => newSocket.close();
    }, [sessionId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const content = input;
        setInput('');

        // Optimistic Update
        const tempMsg = {
            id: Date.now(),
            content,
            sender_type: 'visitor', // or 'user'
            createdAt: new Date()
        };
        setMessages(prev => [...prev, tempMsg]);
        scrollToBottom();

        // Ensure Session
        let activeSessionId = sessionId;
        if (!activeSessionId) {
            // Create Session via HTTP first
            try {
                const res = await fetch(`${SOCKET_URL}/api/chat/start`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: 'Guest' })
                });
                const data = await res.json();
                activeSessionId = data.id || data.session_id; // Check model
                setSessionId(activeSessionId);
                localStorage.setItem('chat_session_id', activeSessionId);
                socket.emit('join', { type: 'visitor', sessionId: activeSessionId });
            } catch (e) {
                console.error('Session Start Error', e);
                return;
            }
        }

        socket.emit('client:message', { sessionId: activeSessionId, content });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chat-widget fixed bottom-6 right-6 z-50 font-sans">
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-blue-700 transition-all hover:scale-105 animate-bounce-subtle"
                >
                    <MessageCircle size={32} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl w-[380px] h-[600px] flex flex-col overflow-hidden border border-slate-200 animate-slide-up">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg">🤖</div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-blue-600 rounded-full"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">AI Assistant</h3>
                                <p className="text-xs text-blue-100">Usually replies instantly</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-white/10 rounded-full"><Minimize2 size={16} /></button>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={16} /></button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 bg-slate-50 p-4 overflow-y-auto space-y-4">
                        {/* Welcome */}
                        <div className="flex gap-2 text-xs text-slate-400 justify-center my-4 font-mono">
                            <span>Started {new Date().toLocaleTimeString()}</span>
                        </div>

                        {messages.map((msg, idx) => (
                            <div key={idx || msg.id} className={`flex ${msg.sender_type === 'visitor' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${msg.sender_type === 'visitor'
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                    {msg.sender_type !== 'visitor' && (
                                        <div className="mt-2 pt-2 border-t border-slate-100 flex gap-2 justify-end opacity-50 text-slate-400">
                                            <ThumbsUp size={12} className="cursor-pointer hover:text-green-500" />
                                            <ThumbsDown size={12} className="cursor-pointer hover:text-red-500" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-3 shadow-sm">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-slate-100 shadow-lg">
                        <div className="flex items-center gap-2 bg-slate-50 rounded-full px-4 py-2 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-100 transition">
                            <input
                                ref={inputRef}
                                type="text"
                                className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                            <button className="text-slate-400 hover:text-blue-600 transition"><Paperclip size={18} /></button>
                            <button onClick={handleSend} className="text-blue-600 hover:text-blue-700 transition"><Send size={18} /></button>
                        </div>
                        <div className="text-center mt-2">
                            <a href="#" className="text-[10px] text-slate-300 hover:text-slate-400">⚡ Powered by AI</a>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default ChatWidget;
