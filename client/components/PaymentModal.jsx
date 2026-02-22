import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Copy, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '../context/SettingsContext';

const PaymentModal = ({ product, isOpen, onClose }) => {
    const { settings } = useSettings();
    const [method, setMethod] = useState('bkash');
    const [step, setStep] = useState(1); // 1: Instructions, 2: Form, 3: Success
    const [formData, setFormData] = useState({ phone: '', trxID: '', email: '' });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const getNumber = () => {
        if (method === 'bkash') return settings.payment_bkash || 'Not Configured';
        if (method === 'nagad') return settings.payment_nagad || 'Not Configured';
        if (method === 'rocket') return settings.payment_rocket || 'Not Configured';
    };

    const copyNumber = () => {
        navigator.clipboard.writeText(getNumber());
        toast.success('Number copied!');
    };

    const handleConfirm = async (e) => {
        e.preventDefault();
        setLoading(true);

        const orderData = {
            productId: product?.id,
            productName: product?.name,
            amount: product?.price,
            customerPhone: formData.phone,
            customerEmail: formData.email,
            customerName: formData.name || '',
            mfsProvider: method,
            transactionID: formData.trxID,
        };

        try {
            const res = await fetch('/api/mfs/init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const json = await res.json();

            if (res.ok && json.success) {
                setStep(3);
            } else {
                toast.error(json.error || 'Order failed. Please try again.');
            }
        } catch {
            toast.error('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold">Complete Payment</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>

                {step === 3 ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Order Submitted!</h2>
                        <p className="text-slate-500 mb-6">We have received your payment details. We will process your order and email you shortly.</p>
                        <button onClick={onClose} className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800">Close</button>
                    </div>
                ) : (
                    <div className="p-6">
                        <div className="flex gap-4 mb-6">
                            {['bkash', 'nagad', 'rocket'].map(m => (
                                <button
                                    key={m}
                                    onClick={() => setMethod(m)}
                                    className={`flex-1 py-2 rounded-lg font-bold border-2 transition capitalize ${method === m ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-slate-100 text-slate-400'}`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 text-center">
                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Send Money To (Personal)</p>
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-2xl font-mono font-bold text-slate-800 tracking-wider">{getNumber()}</span>
                                <button onClick={copyNumber} className="text-blue-500 hover:text-blue-600"><Copy size={18} /></button>
                            </div>
                            <p className="text-sm font-bold text-slate-900 mt-2">Amount: {product.price}</p>
                        </div>

                        <form onSubmit={handleConfirm} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Your Sender Number</label>
                                <input
                                    required
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500"
                                    placeholder="01XXXXXXXXX"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Transaction ID (TrxID)</label>
                                <input
                                    required
                                    value={formData.trxID}
                                    onChange={e => setFormData({ ...formData, trxID: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500 font-mono uppercase"
                                    placeholder="8JHS28..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Account Email (for delivery)</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500"
                                    placeholder="you@email.com"
                                />
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="animate-spin" size={18} />} Confirm Payment
                            </button>
                        </form>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default PaymentModal;
