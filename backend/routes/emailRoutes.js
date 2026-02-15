const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { emailInvoice, emailLeadNotification, emailMaintenanceReminder, emailLogs } = require('../controllers/emailController');

router.post('/invoice/:id', protect, emailInvoice);
router.post('/lead/:id', protect, emailLeadNotification);
router.post('/maintenance/:id', protect, emailMaintenanceReminder);
router.get('/logs', protect, emailLogs);

module.exports = router;
