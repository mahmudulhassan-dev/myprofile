import React, { useState } from 'react';
import { ArrowLeft, Mail, Paperclip, Send, Loader, User, Calendar, MapPin, Globe, Clock, MessageSquare, Download } from 'lucide-react';

const ContactDetail = ({ contact, onBack }) => {
    const [replyData, setReplyData] = useState({ subject: `Re: ${contact.subject}`, message: '' });
    const [status, setStatus] = useState(contact.status);
    const [sending, setSending] = useState(false);

    // Derived state for safe date parsing
    const date = new Date(contact.createdAt).toLocaleString();

    const handleReply = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            const res = await fetch(`/api/admin/contacts/${contact.id}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(replyData)
            });
            if (res.ok) {
                alert('Reply sent successfully!');
                setStatus('replied');
                setReplyData({ ...replyData, message: '' });
            } else {
                alert('Failed to send reply');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSending(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await fetch(`/api/admin/contacts/${contact.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            setStatus(newStatus);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition font-medium">
                    <ArrowLeft size={18} /> Back to Inbox
                </button>
                <div className="flex gap-2 items-center">
                    <span className="text-sm text-slate-500">Status:</span>
                    <select
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="text-sm border rounded-lg px-2 py-1 bg-slate-50 font-medium"
                    >
                        <option value="pending">Pending</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                {/* Header Info */}
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">{contact.subject}</h1>
                        <div className="flex items-center gap-4 text-slate-500 text-sm">
                            <span className="flex items-center gap-1"><User size={14} /> {contact.full_name}</span>
                            <span className="flex items-center gap-1"><Mail size={14} /> {contact.email}</span>
                            <span className="flex items-center gap-1"><Calendar size={14} /> {date}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 text-sm text-right">
                        <div className="bg-slate-50 px-3 py-2 rounded border border-slate-100">
                            <p className="font-semibold text-slate-700">{contact.project_type}</p>
                            <p className="text-slate-500">{contact.budget_range}</p>
                        </div>
                        {contact.phone && <p className="text-slate-500">{contact.phone}</p>}
                    </div>
                </div>

                {/* Message Body */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 mb-8">
                    <p className="whitespace-pre-wrap text-slate-700 leading-relaxed font-serif text-lg">
                        {contact.message}
                    </p>

                    {contact.attachment && (
                        <div className="mt-6 pt-6 border-t border-slate-200">
                            <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                <Paperclip size={16} /> Attachment
                            </h4>
                            <a
                                href={contact.attachment}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
                            >
                                <Download size={16} /> Download File
                            </a>
                        </div>
                    )}
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-xs text-slate-400">
                    <div>
                        <span className="block font-semibold mb-1">IP Address</span>
                        {contact.ip_address}
                    </div>
                    <div>
                        <span className="block font-semibold mb-1">User Agent</span>
                        {contact.user_agent}
                    </div>
                </div>

                {/* Reply Section */}
                <div className="border-t border-slate-200 pt-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <MessageSquare size={20} /> Reply to {contact.full_name}
                    </h3>
                    <form onSubmit={handleReply} className="space-y-4">
                        <input
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-purple/20 outline-none"
                            placeholder="Subject"
                            value={replyData.subject}
                            onChange={e => setReplyData({ ...replyData, subject: e.target.value })}
                        />
                        <textarea
                            className="w-full h-40 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-purple/20 outline-none resize-none"
                            placeholder="Write your reply here..."
                            value={replyData.message}
                            onChange={e => setReplyData({ ...replyData, message: e.target.value })}
                        ></textarea>
                        <div className="flex justify-end">
                            <button
                                disabled={sending}
                                className="bg-primary-purple text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition flex items-center gap-2 disabled:opacity-50"
                            >
                                {sending ? <Loader className="animate-spin" size={18} /> : <Send size={18} />}
                                Send Reply
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactDetail;
