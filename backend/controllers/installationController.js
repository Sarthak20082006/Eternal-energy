const Installation = require('../models/Installation');
const Customer = require('../models/Customer');

// @route GET /api/installations
exports.getInstallations = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const where = {};
        if (status) where.status = status;

        const { count, rows } = await Installation.findAndCountAll({
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

        const data = rows.map(inst => {
            const plain = inst.toJSON();
            plain.customer = customerMap[inst.customerId] || null;
            return plain;
        });

        res.json({ success: true, count, data });
    } catch (error) {
        next(error);
    }
};

// @route GET /api/installations/:id
exports.getInstallation = async (req, res, next) => {
    try {
        const inst = await Installation.findByPk(req.params.id);
        if (!inst) return res.status(404).json({ success: false, message: 'Installation not found' });
        res.json({ success: true, data: inst });
    } catch (error) {
        next(error);
    }
};

// @route POST /api/installations
exports.createInstallation = async (req, res, next) => {
    try {
        const inst = await Installation.create({ ...req.body, customerId: req.body.customer, createdBy: req.user.id });
        res.status(201).json({ success: true, data: inst });
    } catch (error) {
        next(error);
    }
};

// @route PUT /api/installations/:id
exports.updateInstallation = async (req, res, next) => {
    try {
        const inst = await Installation.findByPk(req.params.id);
        if (!inst) return res.status(404).json({ success: false, message: 'Installation not found' });
        await inst.update(req.body);
        res.json({ success: true, data: inst });
    } catch (error) {
        next(error);
    }
};

// @route DELETE /api/installations/:id
exports.deleteInstallation = async (req, res, next) => {
    try {
        const inst = await Installation.findByPk(req.params.id);
        if (!inst) return res.status(404).json({ success: false, message: 'Installation not found' });
        await inst.destroy();
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};
