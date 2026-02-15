const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Customer = sequelize.define('Customer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, defaultValue: '' },
    phone: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.TEXT, defaultValue: '' },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'active',
        validate: { isIn: [['active', 'inactive', 'prospect']] },
    },
    notes: { type: DataTypes.TEXT, defaultValue: '' },
    createdBy: { type: DataTypes.INTEGER },
});

module.exports = Customer;
