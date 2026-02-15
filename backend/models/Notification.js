const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Notification = sequelize.define('Notification', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    type: {
        type: DataTypes.STRING,
        defaultValue: 'info',
        validate: { isIn: [['info', 'success', 'warning', 'alert', 'payment', 'lead', 'installation']] },
    },
    title: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    read: { type: DataTypes.BOOLEAN, defaultValue: false },
    link: { type: DataTypes.STRING, defaultValue: '' },
});

module.exports = Notification;
