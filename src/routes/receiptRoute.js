const express = require('express');
const receiptController = require('../controllers/receiptController');
const caseController = require('../controllers/caseController');

const router = express.Router();

router.route('/cases/:id').post(receiptController.createReceiptByCaseId);

router.route('/cases/:id').get(receiptController.getReceiptByCaseId);

router
  .route('/cases/:caseId/receipts/:receiptId')
  .delete(receiptController.deleteReceiptByCaseIdReceiptId);

router.route('/cases-with-receipt').get(caseController.getCasesWithReceipt);

module.exports = router;
