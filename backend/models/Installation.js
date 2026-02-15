const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Installation = sequelize.define('Installation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    customerId: { type: DataTypes.INTEGER, allowNull: false },
    leadId: { type: DataTypes.INTEGER },
    systemSize: { type: DataTypes.FLOAT, allowNull: false },
    panelName: { type: DataTypes.STRING, defaultValue: '' },
    inverterName: { type: DataTypes.STRING, defaultValue: '' },
    structureName: { type: DataTypes.STRING, defaultValue: '' },
    panelCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'planning',
        validate: { isIn: [['planning', 'material_ordered', 'in_progress', 'completed', 'commissioned']] },
    },
    startDate: { type: DataTypes.DATE },
    completionDate: { type: DataTypes.DATE },
    commissionDate: { type: DataTypes.DATE },
    siteAddress: { type: DataTypes.TEXT, defaultValue: '' },
    notes: { type: DataTypes.TEXT, defaultValue: '' },
    createdBy: { type: DataTypes.INTEGER },
});

module.exports = Installation;
