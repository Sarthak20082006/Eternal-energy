const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Lead = sequelize.define('Lead', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, defaultValue: '' },
    phone: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, defaultValue: '' },
    monthlyUnits: { type: DataTypes.FLOAT, defaultValue: 0 },
    systemSize: { type: DataTypes.FLOAT, allowNull: false },
    panelName: { type: DataTypes.STRING, defaultValue: 'Adani 540W Mono PERC' },
    panelPricePerWatt: { type: DataTypes.FLOAT, defaultValue: 28 },
    inverterName: { type: DataTypes.STRING, defaultValue: 'Growatt 5kW' },
    inverterPrice: { type: DataTypes.FLOAT, defaultValue: 45000 },
    structureName: { type: DataTypes.STRING, defaultValue: 'HDGI Elevated Structure' },
    structurePrice: { type: DataTypes.FLOAT, defaultValue: 40000 },
    panelCost: { type: DataTypes.FLOAT, defaultValue: 0 },
    totalPrice: { type: DataTypes.FLOAT, defaultValue: 0 },
    gstAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'new',
        validate: { isIn: [['new', 'contacted', 'quoted', 'negotiation', 'won', 'lost']] },
    },
    notes: { type: DataTypes.TEXT, defaultValue: '' },
    createdBy: { type: DataTypes.INTEGER },
});

module.exports = Lead;
