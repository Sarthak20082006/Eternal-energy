const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { backupDB, listBackups, restoreDB, systemHealth } = require('../controllers/systemController');

router.get('/health', protect, systemHealth);
router.get('/backup', protect, authorize('admin'), backupDB);
router.get('/backups', protect, authorize('admin'), listBackups);
router.post('/restore/:filename', protect, authorize('admin'), restoreDB);

module.exports = router;
