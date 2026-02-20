import fetch from 'node-fetch';
import { Currency, CurrencyLog } from '../models/index.js';

const PRIMARY_API = 'https://open.er-api.com/v6/latest/USD';
const BACKUP_API = 'https://api.exchangerate-api.com/v4/latest/USD';

export const fetchLiveRates = async () => {
    try {
        let data = await fetchFromSource(PRIMARY_API);
        let source = 'open.er-api.com';

        if (!data) {
            console.log("Primary Currency API failed, switching to backup...");
            data = await fetchFromSource(BACKUP_API);
            source = 'exchangerate-api.com';
        }

        if (!data) throw new Error('All Currency APIs failed');

        return { rates: data.rates, source };
    } catch (error) {
        console.error("Currency Fetch Error:", error);
        await CurrencyLog.create({ status: 'Failed', error_message: error.message });
        return null;
    }
};

const fetchFromSource = async (url) => {
    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        return null;
    }
};

export const updateCurrencyRates = async () => {
    const { rates, source } = await fetchLiveRates();
    if (!rates) return;

    // We only care about BDT (and potentially others if user adds)
    // Find all auto-update currencies
    const currencies = await Currency.findAll({ where: { auto_update: true, is_primary: false } });

    for (const currency of currencies) {
        if (rates[currency.code]) {
            currency.exchange_rate = rates[currency.code];
            currency.last_updated = new Date();
            await currency.save();
        }
    }

    // Log Success (One log per batch update to save space)
    await CurrencyLog.create({
        from_currency: 'USD',
        to_currency: 'ALL',
        rate: 0, // dynamic
        source: source,
        status: 'Success'
    });

    return rates;
};
