import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, User, Bot, Clock, Trash2, CheckCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ChatInbox = () => {
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    // Initial Fetch
    const fetchSessions = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/chat/admin/sessions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setSessions(data);
        } catch (e) { console.error('Error fetching sessions:', e); }
    };

    // Socket Connection
    useEffect(() => {
        const token = localStorage.getItem('token');
        const newSocket = io(SOCKET_URL, {
            query: { token, type: 'agent' }
        });

        newSocket.on('connect', () => {
            console.log('Admin Socket Connected');
            newSocket.emit('join', { type: 'agent', token });
        });

        newSocket.on('agent:new_message', (data) => {
            const { sessionId, message } = data;

            // Update Session List (Move to top)
            setSessions(prev => {
                const existing = prev.find(s => s.session_id === sessionId);
                if (existing) {
                    return [
                        { ...existing, last_seen: new Date(), messages: [...(existing.messages || []), message] },
                        ...prev.filter(s => s.session_id !== sessionId)
                    ];
                } else {
                    // New session (fetch logic or simplified)
                    fetchSessions();
                    return prev;
                }
            });

            // Update Active Chat
            if (selectedSession?.session_id === sessionId) {
                setMessages(prev => [...prev, message]);
                scrollToBottom();
            } else {
                toast.success('New Message from Visitor!');
            }
        });

        // Listen for all messages if we want real-time updates in active chat (redundant with above?)
        // Actually above event 'agent:new_message' is broad. 
        // We also need to listen to 'message' event if we are IN the room.
        // But the server joins us to 'agents' room, not specific session rooms unless we ask.
        // Simplified: Server broadcasts to 'agents' room for ALL messages from visitors.

        setSocket(newSocket);

        fetchSessions();

        return () => newSocket.close();
    }, [selectedSession]); // Re-bind if selected session changes? No, socket is persistent.

    // Fetch History when selecting session
    useEffect(() => {
        if (!selectedSession) return;
        const fetchHistory = async () => {
            try {
                const res = await fetch(`/api/chat/history?sessionId=${selectedSession.session_id}`);
                const data = await res.json();
                setMessages(data);
                scrollToBottom();
            } catch (e) { console.error(e); }
        };
        fetchHistory();
    }, [selectedSession]);

    const scrollToBottom = () => {
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };

    const handleSend = async () => {
        if (!input.trim() || !selectedSession) return;

        const content = input;
        setInput('');

        // Optimistic
        const tempMsg = {
            id: Date.now(),
            content,
            sender_type: 'agent',
            createdAt: new Date()
        };
        setMessages(prev => [...prev, tempMsg]);
        scrollToBottom();

        // Send via Socket
        socket.emit('agent:message', {
            sessionId: selectedSession.session_id,
            content,
            token: localStorage.getItem('token')
        });
    };

    return (
        <div className="flex h-[calc(100vh-140px)] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Sidebar List */}
            <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50">
                <div className="p-4 border-b border-slate-200">
                    <h2 className="font-bold text-slate-700 mb-2">Active Chats</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {sessions.map(session => (
                        <div
                            key={session.id}
                            onClick={() => setSelectedSession(session)}
                            className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-white transition ${selectedSession?.id === session.id ? 'bg-white border-l-4 border-l-blue-600 shadow-sm' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-semibold text-slate-800 text-sm">{session.visitor_name}</span>
                                <span className="text-[10px] text-slate-400">{new Date(session.last_seen || session.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">{session.visitor_email || 'No email'}</p>
                            <div className="mt-2 flex gap-1">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${session.status === 'open' ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-600'}`}>
                                    {session.status}
                                </span>
                            </div>
                        </div>
                    ))}
                    {sessions.length === 0 && (
                        <div className="p-8 text-center text-slate-400 text-sm">No active chats</div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-slate-50/50">
                {selectedSession ? (
                    <>
                        {/* Header */}
                        <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                    {selectedSession.visitor_name?.charAt(0) || 'G'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{selectedSession.visitor_name}</h3>
                                    <p className="text-xs text-slate-500">{selectedSession.visitor_email}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><CheckCircle size={18} /></button>
                                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender_type === 'agent' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] rounded-2xl p-4 shadow-sm text-sm ${msg.sender_type === 'agent'
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : msg.sender_type === 'ai'
                                                ? 'bg-purple-100 text-purple-900 border border-purple-200'
                                                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                                        }`}>
                                        {msg.sender_type === 'ai' && <div className="text-[10px] font-bold mb-1 flex items-center gap-1"><Bot size={10} /> AI Auto-Reply</div>}
                                        {msg.content}
                                        <div className={`text-[10px] mt-2 flex justify-end ${msg.sender_type === 'agent' ? 'text-blue-200' : 'text-slate-400'}`}>
                                            {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white border-t border-slate-200">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                    placeholder="Type your reply..."
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                />
                                <button
                                    onClick={handleSend}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-medium transition shadow-lg shadow-blue-600/20 flex items-center gap-2"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Clock size={32} />
                        </div>
                        <p>Select a chat to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatInbox;
