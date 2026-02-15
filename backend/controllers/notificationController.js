const Notification = require('../models/Notification');

// @route GET /api/notifications
exports.getNotifications = async (req, res, next) => {
    try {
        const notifs = await Notification.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: 50,
        });
        const unread = await Notification.count({ where: { userId: req.user.id, read: false } });
        res.json({ success: true, unread, data: notifs });
    } catch (error) { next(error); }
};

// @route PUT /api/notifications/:id/read
exports.markRead = async (req, res, next) => {
    try {
        const notif = await Notification.findByPk(req.params.id);
        if (!notif) return res.status(404).json({ success: false, message: 'Not found' });
        await notif.update({ read: true });
        res.json({ success: true, data: notif });
    } catch (error) { next(error); }
};

// @route PUT /api/notifications/read-all
exports.markAllRead = async (req, res, next) => {
    try {
        await Notification.update({ read: true }, { where: { userId: req.user.id, read: false } });
        res.json({ success: true });
    } catch (error) { next(error); }
};

// Helper: create notification (used by other controllers)
exports.createNotification = async (userId, type, title, message, link = '') => {
    try {
        await Notification.create({ userId, type, title, message, link });
    } catch (err) { console.error('Notification error:', err.message); }
};
