import React, { useState, useEffect } from 'react';
import { Mail, Phone, Eye, Trash2, Search, Download, CheckCircle, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactManager = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null); // For Details Modal
    const [replyText, setReplyText] = useState('');
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/contact?status=${filter}&search=${searchTerm}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setMessages(data.contacts || []);
        } catch (error) {
            console.error("Failed to load messages", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [filter, searchTerm]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this message?")) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/contact/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success("Message Deleted");
            setMessages(prev => prev.filter(m => m.id !== id));
            if (selectedMessage?.id === id) setSelectedMessage(null);
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const handleReply = async () => {
        if (!selectedMessage) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/contact/${selectedMessage.id}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: replyText })
            });
            toast.success("Reply Sent!");
            setReplyText('');
            setSelectedMessage(null);
            fetchMessages(); // Refresh status
        } catch (error) {
            toast.error("Failed to send reply");
        }
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Contact Messages</h1>
                <div className="flex gap-3">
                    <select
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="p-2 rounded bg-white border border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    >
                        <option value="All">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="replied">Replied</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="p-2 rounded bg-white border border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
                {/* Message List */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden flex flex-col">
                    <div className="p-4 border-b dark:border-slate-700 font-bold">Inbox</div>
                    <div className="flex-1 overflow-y-auto">
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                onClick={() => setSelectedMessage(msg)}
                                className={`p-4 border-b dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition ${selectedMessage?.id === msg.id ? 'bg-blue-50 dark:bg-slate-700 border-l-4 border-l-blue-500' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate w-32">{msg.full_name}</h4>
                                    <span className="text-xs text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate">{msg.subject}</p>
                                <div className="mt-2 flex gap-2">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${msg.status === 'replied' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                        {msg.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Details View */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex flex-col">
                    {selectedMessage ? (
                        <>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{selectedMessage.subject}</h2>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1"><Mail size={14} /> {selectedMessage.email}</span>
                                        <span className="flex items-center gap-1"><Phone size={14} /> {selectedMessage.phone || 'N/A'}</span>
                                        <span className="flex items-center gap-1"><Clock size={14} /> {new Date(selectedMessage.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1">
                                        Browser: {selectedMessage.browser} ({selectedMessage.user_agent})
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(selectedMessage.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={20} /></button>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg text-slate-700 dark:text-slate-300 min-h-[150px] whitespace-pre-wrap mb-6">
                                {selectedMessage.message}
                            </div>

                            {selectedMessage.attachment && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-bold mb-2">Attachment</h4>
                                    <a href={selectedMessage.attachment} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded text-blue-600 hover:bg-blue-50">
                                        <Download size={16} /> Download File
                                    </a>
                                </div>
                            )}

                            <div className="mt-auto border-t pt-6 dark:border-slate-700">
                                <h4 className="font-bold mb-2">Quick Reply</h4>
                                <textarea
                                    className="w-full p-3 border rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                    rows="4"
                                    placeholder="Type your reply here..."
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                ></textarea>
                                <button onClick={handleReply} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2">
                                    <Send size={18} /> Send Reply
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <Mail size={48} className="mb-4 opacity-20" />
                            <p>Select a message to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactManager;
