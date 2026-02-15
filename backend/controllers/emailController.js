const { getEmailLogs, sendInvoiceEmail, sendLeadNotification, sendMaintenanceReminder } = require('../utils/emailService');
const Invoice = require('../models/Invoice');
const Lead = require('../models/Lead');
const Installation = require('../models/Installation');

// @route POST /api/email/invoice/:id
exports.emailInvoice = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Email address required' });

        const invoice = await Invoice.findByPk(req.params.id);
        if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

        const result = await sendInvoiceEmail(email, invoice.toJSON());
        res.json({ success: true, message: `Invoice emailed to ${email}`, data: result });
    } catch (error) { next(error); }
};

// @route POST /api/email/lead/:id
exports.emailLeadNotification = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Email address required' });

        const lead = await Lead.findByPk(req.params.id);
        if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

        const result = await sendLeadNotification(email, lead.toJSON());
        res.json({ success: true, message: `Lead notification sent to ${email}`, data: result });
    } catch (error) { next(error); }
};

// @route POST /api/email/maintenance/:id
exports.emailMaintenanceReminder = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Email address required' });

        const inst = await Installation.findByPk(req.params.id);
        if (!inst) return res.status(404).json({ success: false, message: 'Installation not found' });

        const result = await sendMaintenanceReminder(email, inst.toJSON());
        res.json({ success: true, message: `Maintenance reminder sent to ${email}`, data: result });
    } catch (error) { next(error); }
};

// @route GET /api/email/logs
exports.emailLogs = async (req, res) => {
    const logs = getEmailLogs();
    res.json({ success: true, data: logs.reverse() });
};
