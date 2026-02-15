const { validationResult, body, param, query } = require('express-validator');

// Check validation result middleware
const checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
        });
    }
    next();
};

// Auth validation rules
const registerRules = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['admin', 'employee', 'customer']).withMessage('Invalid role'),
];

const loginRules = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

// Lead validation rules
const leadRules = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('monthlyUnits').isNumeric().withMessage('Monthly units must be a number'),
    body('systemSize').isFloat({ min: 1, max: 100 }).withMessage('System size must be between 1-100 kW'),
];

// Customer validation rules
const customerRules = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
];

// Invoice validation rules
const invoiceRules = [
    body('customer').isInt().withMessage('Valid customer ID is required'),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.description').notEmpty().withMessage('Item description is required'),
    body('items.*.unitPrice').isNumeric().withMessage('Unit price must be a number'),
    body('items.*.quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be positive'),
];

// Pagination validation
const paginationRules = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1-100'),
];

module.exports = {
    checkValidation,
    registerRules,
    loginRules,
    leadRules,
    customerRules,
    invoiceRules,
    paginationRules,
};
