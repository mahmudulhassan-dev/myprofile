import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';

const CurrencyToggle = () => {
    const { currency, changeCurrency } = useCurrency();

    return (
        <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
            <button
                onClick={() => changeCurrency('USD')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${currency === 'USD' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'
                    }`}
            >
                USD
            </button>
            <button
                onClick={() => changeCurrency('BDT')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${currency === 'BDT' ? 'bg-white shadow text-green-600' : 'text-slate-500 hover:text-slate-700'
                    }`}
            >
                BDT
            </button>
        </div>
    );
};

export default CurrencyToggle;
