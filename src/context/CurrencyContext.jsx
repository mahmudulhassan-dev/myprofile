import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState('USD');
    const [rates, setRates] = useState({ USD: 1, BDT: 120 }); // Default fallback
    const [currencies, setCurrencies] = useState([]);

    useEffect(() => {
        // Load preference
        const saved = localStorage.getItem('currency');
        if (saved) setCurrency(saved);

        fetchRates();
    }, []);

    const fetchRates = async () => {
        try {
            const res = await fetch('/api/currency');
            const data = await res.json();
            setCurrencies(data);

            const newRates = {};
            data.forEach(c => newRates[c.code] = c.exchange_rate);
            setRates(newRates);
        } catch (e) {
            console.error("Currency Load Error", e);
        }
    };

    const changeCurrency = (code) => {
        setCurrency(code);
        localStorage.setItem('currency', code);
    };

    const formatPrice = (amountInUSD) => {
        const rate = rates[currency] || 1;
        const converted = amountInUSD * rate;
        const symbol = currencies.find(c => c.code === currency)?.symbol || '$';

        if (currency === 'BDT') {
            return `${symbol}${Math.round(converted).toLocaleString()}`;
        }
        return `${symbol}${converted.toFixed(2)}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, changeCurrency, formatPrice, currencies }}>
            {children}
        </CurrencyContext.Provider>
    );
};
