const { Op, fn, col, literal } = require('sequelize');
const Lead = require('../models/Lead');
const Customer = require('../models/Customer');
const Invoice = require('../models/Invoice');
const Installation = require('../models/Installation');

// @route GET /api/dashboard/stats
exports.getStats = async (req, res, next) => {
    try {
        // Overview counts
        const totalLeads = await Lead.count();
        const totalCustomers = await Customer.count();
        const totalInstallations = await Installation.count();

        // Revenue from invoices
        const invoices = await Invoice.findAll({ where: { paymentStatus: { [Op.ne]: 'cancelled' } } });
        const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

        // Total capacity
        const installations = await Installation.findAll();
        const totalCapacityKW = installations.reduce((sum, inst) => sum + (inst.systemSize || 0), 0);

        // Leads by status
        const leadsByStatus = {};
        const leadStatusGroups = await Lead.findAll({
            attributes: ['status', [fn('COUNT', col('id')), 'count']],
            group: ['status'],
        });
        leadStatusGroups.forEach(g => { leadsByStatus[g.status] = parseInt(g.getDataValue('count')); });

        // Installations by status
        const installationsByStatus = {};
        const instStatusGroups = await Installation.findAll({
            attributes: ['status', [fn('COUNT', col('id')), 'count']],
            group: ['status'],
        });
        instStatusGroups.forEach(g => { installationsByStatus[g.status] = parseInt(g.getDataValue('count')); });

        // Monthly revenue (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const recentInvoices = await Invoice.findAll({
            where: { createdAt: { [Op.gte]: sixMonthsAgo }, paymentStatus: { [Op.ne]: 'cancelled' } },
            order: [['createdAt', 'ASC']],
        });

        const monthlyMap = {};
        recentInvoices.forEach(inv => {
            const d = new Date(inv.createdAt);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            monthlyMap[key] = (monthlyMap[key] || 0) + (inv.totalAmount || 0);
        });
        const monthlyRevenue = Object.entries(monthlyMap).map(([month, revenue]) => ({ month, revenue }));

        // City distribution
        const cityGroups = await Lead.findAll({
            attributes: ['city', [fn('COUNT', col('id')), 'count'], [fn('SUM', col('totalPrice')), 'totalValue']],
            group: ['city'],
            order: [[fn('COUNT', col('id')), 'DESC']],
            limit: 10,
        });
        const cityDistribution = cityGroups.map(g => ({
            _id: g.city,
            count: parseInt(g.getDataValue('count')),
            totalValue: parseFloat(g.getDataValue('totalValue')) || 0,
        }));

        // Recent leads
        const recentLeads = await Lead.findAll({ order: [['createdAt', 'DESC']], limit: 5 });

        res.json({
            success: true,
            data: {
                overview: { totalLeads, totalCustomers, totalInstallations, totalRevenue, totalCapacityKW },
                leadsByStatus,
                installationsByStatus,
                monthlyRevenue,
                cityDistribution,
                recentLeads,
            },
        });
    } catch (error) {
        next(error);
    }
};
