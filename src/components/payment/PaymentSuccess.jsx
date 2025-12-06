import React, { useEffect } from 'react';
// Removed react-router-dom
import { CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const PaymentSuccess = () => {
    // Native query param extraction
    const searchParams = new URLSearchParams(window.location.search);
    const tran_id = searchParams.get('tran_id');

    useEffect(() => {
        // Fire confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-green-100 p-4 rounded-full">
                        <CheckCircle className="text-green-600 w-12 h-12" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h1>
                <p className="text-slate-500 mb-6">
                    Thank you for your purchase. Your transaction ID is <br />
                    <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-700 text-sm">{tran_id || 'N/A'}</span>
                </p>
                <div className="space-y-3">
                    <a href="/orders" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition">
                        View Order
                    </a>
                    <a href="/" className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-xl transition">
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
