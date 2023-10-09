const express = require('express');
const paymentController = require('../controllers/paymentController');
const caseController = require('../controllers/caseController');

const router = express.Router();

router.route('/cases-no-receipt').get(paymentController.getCasesNoReceipt);

router.route('/cases-no-receipt/:id').get(caseController.getCaseById);

module.exports = router;
