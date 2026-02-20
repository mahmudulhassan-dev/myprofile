import { Currency, CurrencyLog } from '../models/index.js';
import { updateCurrencyRates } from '../services/currencyService.js';

export const getCurrencies = async (req, res) => {
    try {
        let currencies = await Currency.findAll();
        // Seed if empty
        if (currencies.length === 0) {
            await Currency.bulkCreate([
                { code: 'USD', name: 'US Dollar', symbol: '$', exchange_rate: 1, is_primary: true, auto_update: false },
                { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', exchange_rate: 120, is_primary: false, auto_update: true }
            ]);
            currencies = await Currency.findAll();
        }
        res.json(currencies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCurrency = async (req, res) => {
    try {
        const { id } = req.params;
        const currency = await Currency.findByPk(id);
        if (!currency) return res.status(404).json({ message: 'Currency not found' });

        await currency.update(req.body);
        res.json(currency);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const forceUpdateRates = async (req, res) => {
    try {
        const result = await updateCurrencyRates();
        if (result) res.json({ message: 'Rates updated successfully' });
        else res.status(500).json({ message: 'Failed to fetch rates' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getLogs = async (req, res) => {
    try {
        const logs = await CurrencyLog.findAll({ limit: 50, order: [['createdAt', 'DESC']] });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
