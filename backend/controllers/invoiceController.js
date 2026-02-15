const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const { generateInvoiceNumber } = require('../utils/helpers');

// @route GET /api/invoices
exports.getInvoices = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, paymentStatus } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const where = {};
        if (paymentStatus) where.paymentStatus = paymentStatus;

        const { count, rows } = await Invoice.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset,
        });

        // Attach customer data
        const customerIds = [...new Set(rows.map(i => i.customerId))];
        const customers = await Customer.findAll({ where: { id: customerIds } });
        const customerMap = {};
        customers.forEach(c => { customerMap[c.id] = { name: c.name, city: c.city }; });

        const data = rows.map(inv => {
            const plain = inv.toJSON();
            plain.customer = customerMap[inv.customerId] || null;
            return plain;
        });

        res.json({ success: true, count, data });
    } catch (error) {
        next(error);
    }
};

// @route GET /api/invoices/:id
exports.getInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id);
        if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
        res.json({ success: true, data: invoice });
    } catch (error) {
        next(error);
    }
};

// @route POST /api/invoices
exports.createInvoice = async (req, res, next) => {
    try {
        const { customer, items, discountPercent = 0, gstRate = 18, notes, dueDate } = req.body;

        // Calculate totals
        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const discountAmount = Math.round(subtotal * (discountPercent / 100));
        const afterDiscount = subtotal - discountAmount;
        const gstAmount = Math.round(afterDiscount * (gstRate / 100));
        const totalAmount = afterDiscount + gstAmount;

        const invoice = await Invoice.create({
            invoiceNumber: generateInvoiceNumber(),
            customerId: customer,
            items,
            subtotal,
            discountPercent,
            discountAmount,
            gstRate,
            gstAmount,
            totalAmount,
            notes,
            dueDate,
            createdBy: req.user.id,
        });

        res.status(201).json({ success: true, data: invoice });
    } catch (error) {
        next(error);
    }
};

// @route PUT /api/invoices/:id
exports.updateInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id);
        if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
        await invoice.update(req.body);
        res.json({ success: true, data: invoice });
    } catch (error) {
        next(error);
    }
};

// @route DELETE /api/invoices/:id
exports.deleteInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id);
        if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
        await invoice.destroy();
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};
