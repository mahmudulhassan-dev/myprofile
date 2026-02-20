import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Paperclip, Loader } from 'lucide-react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        project_type: 'Website',
        budget_range: '$300-1000',
        consent: false
    });
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.consent) {
            setErrorMessage('Please accept the privacy policy.');
            return;
        }

        setStatus('submitting');
        setErrorMessage('');

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (file) data.append('attachment', file);

        try {
            const res = await fetch('/api/contact/submit', {
                method: 'POST',
                body: data
            });
            const result = await res.json();

            if (!res.ok) throw new Error(result.error || 'Failed to send message');

            setStatus('success');
            setFormData({
                full_name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
                project_type: 'Website',
                budget_range: '$300-1000',
                consent: false
            });
            setFile(null);
        } catch (error) {
            console.error(error);
            setStatus('error');
            setErrorMessage(error.message);
        }
    };

    if (status === 'success') {
        return (
            <div className="text-center p-8 bg-green-50 rounded-xl border border-green-100">
                <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Message Sent!</h3>
                <p className="text-slate-600 mb-6">Thank you for reaching out. I'll get back to you within 24 hours.</p>
                <div className="flex justify-center gap-4">
                    <button onClick={() => setStatus('idle')} className="text-sm text-green-600 font-medium hover:underline">
                        Send another message
                    </button>
                    <a href="https://wa.me/yourphonenumber" target="_blank" rel="noreferrer" className="text-sm font-medium bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                        Chat on WhatsApp
                    </a>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="full_name"
                        required
                        value={formData.full_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 transition outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 transition outline-none"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone (Optional)</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 transition outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 transition outline-none"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Project Type</label>
                    <select
                        name="project_type"
                        value={formData.project_type}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 transition outline-none bg-white"
                    >
                        <option>Website</option>
                        <option>App Development</option>
                        <option>Design</option>
                        <option>E-commerce</option>
                        <option>Marketing</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Budget Range</label>
                    <select
                        name="budget_range"
                        value={formData.budget_range}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 transition outline-none bg-white"
                    >
                        <option>&lt; $100</option>
                        <option>$100 - $300</option>
                        <option>$300 - $1000</option>
                        <option>$1000+</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message <span className="text-red-500">*</span></label>
                <textarea
                    name="message"
                    required
                    minLength={20}
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 transition outline-none resize-y"
                    placeholder="Tell me about your project..."
                ></textarea>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Attachment (Optional)</label>
                <div className="relative border-2 border-dashed border-slate-200 hover:border-primary-purple/50 rounded-lg p-6 text-center transition cursor-pointer bg-slate-50 hover:bg-slate-100">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.zip"
                    />
                    <div className="flex flex-col items-center pointer-events-none">
                        <Paperclip className="text-slate-400 mb-2" />
                        <span className="text-sm text-slate-600">
                            {file ? file.name : 'Drag & drop or browse to upload'}
                        </span>
                        <span className="text-xs text-slate-400 mt-1">Max 10MB</span>
                    </div>
                </div>
            </div>

            <div className="flex items-start gap-2">
                <input
                    type="checkbox"
                    name="consent"
                    id="consent"
                    required
                    checked={formData.consent}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-primary-purple border-slate-300 rounded focus:ring-primary-purple"
                />
                <label htmlFor="consent" className="text-sm text-slate-600">
                    I agree to the <a href="/privacy" className="text-primary-purple hover:underline">privacy policy</a> and consent to being contacted.
                </label>
            </div>

            {status === 'error' && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle size={16} />
                    {errorMessage}
                </div>
            )}

            <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-gradient-to-r from-primary-purple to-aurora-blue text-white py-4 rounded-lg font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex justify-center items-center gap-2"
            >
                {status === 'submitting' ? <Loader className="animate-spin" /> : <><Send size={20} /> Send Project Inquiry</>}
            </button>
        </form>
    );
};

export default ContactForm;
