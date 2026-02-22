import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Order = sequelize.define('Order', {
    productId: DataTypes.INTEGER,
    productName: DataTypes.STRING,
    amount: DataTypes.STRING,
    customerName: DataTypes.STRING,
    customerPhone: DataTypes.STRING,
    customerEmail: DataTypes.STRING,
    address: DataTypes.TEXT,
    paymentMethod: DataTypes.STRING,
    transactionID: { type: DataTypes.STRING, unique: true },
    mfsProvider: { type: DataTypes.STRING, defaultValue: null },
    val_id: DataTypes.STRING,
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
    payment_status: { type: DataTypes.STRING, defaultValue: 'Unpaid' }
});

const Booking = sequelize.define('Booking', {
    serviceId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    clientName: DataTypes.STRING,
    clientEmail: { type: DataTypes.STRING, allowNull: false },
    clientPhone: DataTypes.STRING,
    scheduledDate: DataTypes.DATE,
    requirements: DataTypes.TEXT,
    status: { type: DataTypes.ENUM('requested', 'confirmed', 'in-progress', 'completed', 'cancelled'), defaultValue: 'requested' },
    paymentStatus: { type: DataTypes.ENUM('unpaid', 'partially-paid', 'paid'), defaultValue: 'unpaid' },
    amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    transactionId: DataTypes.STRING,
    meta: { type: DataTypes.JSON, defaultValue: {} }
});

const Service = sequelize.define('Service', {
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    description: DataTypes.TEXT,
    icon: DataTypes.STRING,
    price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    features: { type: DataTypes.JSON, defaultValue: [] },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    order: { type: DataTypes.INTEGER, defaultValue: 0 }
});

export { Order, Booking, Service };
