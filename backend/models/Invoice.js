const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Invoice = sequelize.define('Invoice', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    invoiceNumber: { type: DataTypes.STRING, unique: true },
    customerId: { type: DataTypes.INTEGER, allowNull: false },
    items: {
        type: DataTypes.TEXT, // Stored as JSON string
        defaultValue: '[]',
        get() {
            const raw = this.getDataValue('items');
            return raw ? JSON.parse(raw) : [];
        },
        set(val) {
            this.setDataValue('items', JSON.stringify(val));
        },
    },
    subtotal: { type: DataTypes.FLOAT, defaultValue: 0 },
    discountPercent: { type: DataTypes.FLOAT, defaultValue: 0 },
    discountAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
    gstRate: { type: DataTypes.FLOAT, defaultValue: 18 },
    gstAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
    totalAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
    paymentStatus: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
        validate: { isIn: [['pending', 'partial', 'paid', 'overdue', 'cancelled']] },
    },
    dueDate: { type: DataTypes.DATE },
    notes: { type: DataTypes.TEXT, defaultValue: '' },
    paidAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
    createdBy: { type: DataTypes.INTEGER },
});

module.exports = Invoice;
