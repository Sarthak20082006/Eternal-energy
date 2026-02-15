const { Op } = require('sequelize');
const Customer = require('../models/Customer');

// @route GET /api/customers
exports.getCustomers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, status } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const where = {};
        if (status) where.status = status;
        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } },
                { city: { [Op.like]: `%${search}%` } },
            ];
        }

        const { count, rows } = await Customer.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset,
        });

        res.json({ success: true, count, data: rows });
    } catch (error) {
        next(error);
    }
};

// @route GET /api/customers/:id
exports.getCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
        res.json({ success: true, data: customer });
    } catch (error) {
        next(error);
    }
};

// @route POST /api/customers
exports.createCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.create({ ...req.body, createdBy: req.user.id });
        res.status(201).json({ success: true, data: customer });
    } catch (error) {
        next(error);
    }
};

// @route PUT /api/customers/:id
exports.updateCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
        await customer.update(req.body);
        res.json({ success: true, data: customer });
    } catch (error) {
        next(error);
    }
};

// @route DELETE /api/customers/:id
exports.deleteCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
        await customer.destroy();
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};
