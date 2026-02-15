const express = require('express');
const router = express.Router();
const { getLeads, getLead, createLead, updateLead, deleteLead } = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/auth');
const { leadRules, paginationRules, checkValidation } = require('../middleware/validate');

router.use(protect); // All lead routes are protected

router.route('/')
    .get(paginationRules, checkValidation, getLeads)
    .post(leadRules, checkValidation, createLead);

router.route('/:id')
    .get(getLead)
    .put(updateLead)
    .delete(authorize('admin', 'employee'), deleteLead);

module.exports = router;
