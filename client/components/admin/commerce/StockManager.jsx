
import React from 'react';
import { Package } from 'lucide-react';

const StockManager = () => {
    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                    <Package size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Stock Manager</h1>
                    <p className="text-slate-500">Centralized inventory control</p>
                </div>
            </div>

            <div className="bg-white border boundary-slate-200 rounded-xl p-10 flex flex-col items-center justify-center min-h-[400px]">
                <h3 className="text-xl font-bold text-slate-400">Inventory Command Center</h3>
                <p className="text-slate-400 max-w-md text-center mt-2">
                    Quickly update stock for all products and management warehouses.
                </p>
            </div>
        </div>
    );
};

export default StockManager;
