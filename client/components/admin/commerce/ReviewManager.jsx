
import React from 'react';
import { MessageSquare } from 'lucide-react';

const ReviewManager = () => {
    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
                    <MessageSquare size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Reviews Manager</h1>
                    <p className="text-slate-500">Moderate product reviews and ratings</p>
                </div>
            </div>

            <div className="bg-white border boundary-slate-200 rounded-xl p-10 flex flex-col items-center justify-center min-h-[400px]">
                <h3 className="text-xl font-bold text-slate-400">Customer Reviews System</h3>
                <p className="text-slate-400 max-w-md text-center mt-2">
                    Approve, reply, and manage customer feedback.
                </p>
            </div>
        </div>
    );
};

export default ReviewManager;
