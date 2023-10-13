const express = require('express');
const receiptController = require('../controllers/receiptController');

const router = express.Router();

router.route('/cases/:id').post(receiptController.createReceiptByCaseId);

router.route('/cases/:id').get(receiptController.getReceiptByCaseId);

router
  .route('/cases/:caseId/receipts/:receiptId')
  .delete(receiptController.deleteReceiptByCaseIdReceiptId);

module.exports = router;
