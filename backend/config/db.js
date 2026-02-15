const { Sequelize } = require('sequelize');
const path = require('path');
const logger = require('../utils/logger');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'data', 'eternal_energy.db'),
  logging: false,
  define: {
    timestamps: true,
    underscored: false,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('SQLite Database connected successfully');

    // Sync all models (creates tables if not exist)
    await sequelize.sync({ alter: false });
    logger.info('Database tables synced');

    // Add database indexes for performance
    const qi = sequelize.getQueryInterface();
    const addIndex = async (table, cols, name) => {
      try { await qi.addIndex(table, cols, { name, unique: false }); } catch { }
    };
    await addIndex('Leads', ['status'], 'idx_leads_status');
    await addIndex('Leads', ['city'], 'idx_leads_city');
    await addIndex('Leads', ['createdBy'], 'idx_leads_createdBy');
    await addIndex('Leads', ['createdAt'], 'idx_leads_createdAt');
    await addIndex('Customers', ['email'], 'idx_customers_email');
    await addIndex('Customers', ['city'], 'idx_customers_city');
    await addIndex('Invoices', ['paymentStatus'], 'idx_invoices_status');
    await addIndex('Invoices', ['customer'], 'idx_invoices_customer');
    await addIndex('Installations', ['status'], 'idx_installations_status');
    await addIndex('Installations', ['customer'], 'idx_installations_customer');
    await addIndex('Notifications', ['userId', 'read'], 'idx_notif_user_read');
    logger.info('Database indexes applied');
  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
