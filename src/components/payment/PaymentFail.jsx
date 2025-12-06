import React from 'react';
import { XCircle } from 'lucide-react';

const PaymentFail = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-100 p-4 rounded-full">
                        <XCircle className="text-red-600 w-12 h-12" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Payment Failed</h1>
                <p className="text-slate-500 mb-6">
                    We couldn't process your payment. Please try again or contact support.
                </p>
                <div className="space-y-3">
                    <a href="/checkout" className="block w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl transition">
                        Try Again
                    </a>
                    <a href="/" className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-xl transition">
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PaymentFail;
