const { Op } = require('sequelize');
const Lead = require('../models/Lead');
const { calculatePricing } = require('../utils/pricing');

// @route GET /api/leads
exports.getLeads = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, status, city } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const where = {};
        if (status) where.status = status;
        if (city) where.city = city;
        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } },
                { city: { [Op.like]: `%${search}%` } },
            ];
        }

        const { count, rows } = await Lead.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset,
        });

        res.json({
            success: true,
            count,
            pagination: { page: parseInt(page), limit: parseInt(limit), total: count, pages: Math.ceil(count / parseInt(limit)) },
            data: rows,
        });
    } catch (error) {
        next(error);
    }
};

// @route GET /api/leads/:id
exports.getLead = async (req, res, next) => {
    try {
        const lead = await Lead.findByPk(req.params.id);
        if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
        res.json({ success: true, data: lead });
    } catch (error) {
        next(error);
    }
};

// @route POST /api/leads
exports.createLead = async (req, res, next) => {
    try {
        const { systemSize, panelPricePerWatt, inverterPrice, structurePrice } = req.body;
        const pricing = calculatePricing(systemSize || 5, panelPricePerWatt || 28, inverterPrice || 45000, structurePrice || 40000);

        const lead = await Lead.create({
            ...req.body,
            panelCost: pricing.panelCost,
            totalPrice: pricing.totalWithGST,
            gstAmount: pricing.gstAmount,
            createdBy: req.user.id,
        });

        res.status(201).json({ success: true, data: lead });
    } catch (error) {
        next(error);
    }
};

// @route PUT /api/leads/:id
exports.updateLead = async (req, res, next) => {
    try {
        const lead = await Lead.findByPk(req.params.id);
        if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

        await lead.update(req.body);
        res.json({ success: true, data: lead });
    } catch (error) {
        next(error);
    }
};

// @route DELETE /api/leads/:id
exports.deleteLead = async (req, res, next) => {
    try {
        const lead = await Lead.findByPk(req.params.id);
        if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

        await lead.destroy();
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};
