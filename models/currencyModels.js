import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Currency = sequelize.define('Currency', {
    code: { type: DataTypes.STRING, unique: true, allowNull: false }, // USD, BDT
    name: DataTypes.STRING,
    symbol: DataTypes.STRING, // $, ৳
    exchange_rate: { type: DataTypes.FLOAT, defaultValue: 1.0 }, // Base is always USD (1.0)
    is_primary: { type: DataTypes.BOOLEAN, defaultValue: false }, // Base currency
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    auto_update: { type: DataTypes.BOOLEAN, defaultValue: true },
    last_updated: DataTypes.DATE
});

const CurrencyLog = sequelize.define('CurrencyLog', {
    from_currency: DataTypes.STRING,
    to_currency: DataTypes.STRING,
    rate: DataTypes.FLOAT,
    source: DataTypes.STRING, // API Name
    status: { type: DataTypes.ENUM('Success', 'Failed'), defaultValue: 'Success' },
    error_message: DataTypes.STRING
});

// Settings specifically for Currency System (Interval, API Keys)
const CurrencySetting = sequelize.define('CurrencySetting', {
    key: { type: DataTypes.STRING, unique: true },
    value: DataTypes.TEXT
});

export { Currency, CurrencyLog, CurrencySetting };
