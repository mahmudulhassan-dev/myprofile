
import React from 'react';
import { BarChart2 } from 'lucide-react';

const MHDashboard = () => {
    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                    <BarChart2 size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">MH Commerce Dashboard</h1>
                    <p className="text-slate-500">Overview of your store performance</p>
                </div>
            </div>

            <div className="bg-white border boundary-slate-200 rounded-xl p-10 flex flex-col items-center justify-center min-h-[400px]">
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/business-dashboard-illustration-download-in-svg-png-gif-file-formats--analytics-graph-chart-pack-seo-web-illustrations-4489814.png" alt="Dashboard" className="w-64 opacity-50 mb-4" />
                <h3 className="text-xl font-bold text-slate-400">Dashboard Analytics Coming Soon</h3>
                <p className="text-slate-400 max-w-md text-center mt-2">
                    Visualizing sales data, top products, and inventory alerts.
                </p>
            </div>
        </div>
    );
};

export default MHDashboard;
