const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { generateInvoicePDF } = require('../controllers/pdfController');
const { exportLeads, exportCustomers, exportInvoices, exportInstallations } = require('../controllers/exportController');

// PDF
router.get('/invoice/:id/pdf', protect, generateInvoicePDF);

// CSV exports
router.get('/leads', protect, exportLeads);
router.get('/customers', protect, exportCustomers);
router.get('/invoices', protect, exportInvoices);
router.get('/installations', protect, exportInstallations);

module.exports = router;
