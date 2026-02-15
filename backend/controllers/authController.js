const User = require('../models/User');

// @route POST /api/auth/register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role, phone } = req.body;

        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const user = await User.create({ name, email, password, role, phone });

        const token = user.getSignedJwtToken();
        res.status(201).json({ success: true, token, data: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        next(error);
    }
};

// @route POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = user.getSignedJwtToken();
        res.json({ success: true, token, data: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        next(error);
    }
};

// @route GET /api/auth/me
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// @route PUT /api/auth/me
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;
        const user = await User.findByPk(req.user.id);
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        await user.save();
        res.json({ success: true, data: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
    } catch (error) { next(error); }
};

// @route PUT /api/auth/password
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect' });

        user.password = newPassword;
        await user.save();
        res.json({ success: true, message: 'Password updated' });
    } catch (error) { next(error); }
};
