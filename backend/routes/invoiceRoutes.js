const express = require('express');
const router = express.Router();
const { getInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice } = require('../controllers/invoiceController');
const { protect, authorize } = require('../middleware/auth');
const { invoiceRules, paginationRules, checkValidation } = require('../middleware/validate');

router.use(protect);

router.route('/')
    .get(paginationRules, checkValidation, getInvoices)
    .post(invoiceRules, checkValidation, createInvoice);

router.route('/:id')
    .get(getInvoice)
    .put(updateInvoice)
    .delete(authorize('admin'), deleteInvoice);

module.exports = router;
