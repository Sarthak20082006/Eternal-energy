const express = require('express');
const router = express.Router();
const { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/auth');
const { customerRules, paginationRules, checkValidation } = require('../middleware/validate');

router.use(protect);

router.route('/')
    .get(paginationRules, checkValidation, getCustomers)
    .post(customerRules, checkValidation, createCustomer);

router.route('/:id')
    .get(getCustomer)
    .put(updateCustomer)
    .delete(authorize('admin', 'employee'), deleteCustomer);

module.exports = router;
