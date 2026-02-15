const Lead = require('../models/Lead');
const Customer = require('../models/Customer');
const Invoice = require('../models/Invoice');
const Installation = require('../models/Installation');

// Generic CSV generator
const toCSV = (data, columns) => {
    const header = columns.map(c => c.label).join(',');
    const rows = data.map(row =>
        columns.map(c => {
            let val = c.key.split('.').reduce((obj, k) => obj?.[k], row) ?? '';
            val = String(val).replace(/,/g, ';').replace(/"/g, '""');
            return `"${val}"`;
        }).join(',')
    );
    return [header, ...rows].join('\n');
};

// @route GET /api/export/leads
exports.exportLeads = async (req, res, next) => {
    try {
        const leads = await Lead.findAll({ order: [['createdAt', 'DESC']], raw: true });
        const csv = toCSV(leads, [
            { label: 'Name', key: 'name' },
            { label: 'Email', key: 'email' },
            { label: 'Phone', key: 'phone' },
            { label: 'City', key: 'city' },
            { label: 'System Size (kW)', key: 'systemSize' },
            { label: 'Panel', key: 'panelName' },
            { label: 'Total Price', key: 'totalPrice' },
            { label: 'GST', key: 'gstAmount' },
            { label: 'Status', key: 'status' },
            { label: 'Created', key: 'createdAt' },
        ]);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
        res.send(csv);
    } catch (error) { next(error); }
};

// @route GET /api/export/customers
exports.exportCustomers = async (req, res, next) => {
    try {
        const data = await Customer.findAll({ order: [['createdAt', 'DESC']], raw: true });
        const csv = toCSV(data, [
            { label: 'Name', key: 'name' },
            { label: 'Email', key: 'email' },
            { label: 'Phone', key: 'phone' },
            { label: 'City', key: 'city' },
            { label: 'Address', key: 'address' },
            { label: 'Status', key: 'status' },
            { label: 'Created', key: 'createdAt' },
        ]);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=customers.csv');
        res.send(csv);
    } catch (error) { next(error); }
};

// @route GET /api/export/invoices
exports.exportInvoices = async (req, res, next) => {
    try {
        const data = await Invoice.findAll({ order: [['createdAt', 'DESC']], raw: true });
        const csv = toCSV(data, [
            { label: 'Invoice #', key: 'invoiceNumber' },
            { label: 'Subtotal', key: 'subtotal' },
            { label: 'Discount %', key: 'discountPercent' },
            { label: 'GST', key: 'gstAmount' },
            { label: 'Total', key: 'totalAmount' },
            { label: 'Payment Status', key: 'paymentStatus' },
            { label: 'Created', key: 'createdAt' },
        ]);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=invoices.csv');
        res.send(csv);
    } catch (error) { next(error); }
};

// @route GET /api/export/installations
exports.exportInstallations = async (req, res, next) => {
    try {
        const data = await Installation.findAll({ order: [['createdAt', 'DESC']], raw: true });
        const csv = toCSV(data, [
            { label: 'System Size (kW)', key: 'systemSize' },
            { label: 'Panel', key: 'panelName' },
            { label: 'Inverter', key: 'inverterName' },
            { label: 'Status', key: 'status' },
            { label: 'Site Address', key: 'siteAddress' },
            { label: 'Created', key: 'createdAt' },
        ]);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=installations.csv');
        res.send(csv);
    } catch (error) { next(error); }
};
