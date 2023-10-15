const express = require('express');
const authenticate = require('../middlewares/authenticate');
const receiptController = require('../controllers/receiptController');
const caseController = require('../controllers/caseController');

const router = express.Router();

router
  .route('/cases/:id')
  .post(authenticate.authorizeStaff, receiptController.createReceiptByCaseId);

router
  .route('/cases/:id')
  .get(authenticate.authorizeStaff, receiptController.getReceiptByCaseId);

router
  .route('/cases/:caseId/receipts/:receiptId')
  .delete(
    authenticate.authorizeStaff,
    receiptController.deleteReceiptByCaseIdReceiptId
  );

router
  .route('/cases-with-receipt')
  .get(authenticate.authorizeStaff, caseController.getCasesWithReceipt);

router
  .route('/patient')
  .get(authenticate.authorizePatient, receiptController.getReceiptsByPatientId);

module.exports = router;
