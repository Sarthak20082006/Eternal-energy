const express = require('express');
const router = express.Router();
const { getInstallations, getInstallation, createInstallation, updateInstallation, deleteInstallation } = require('../controllers/installationController');
const { protect, authorize } = require('../middleware/auth');
const { paginationRules, checkValidation } = require('../middleware/validate');

router.use(protect);

router.route('/')
    .get(paginationRules, checkValidation, getInstallations)
    .post(createInstallation);

router.route('/:id')
    .get(getInstallation)
    .put(updateInstallation)
    .delete(authorize('admin', 'employee'), deleteInstallation);

module.exports = router;
