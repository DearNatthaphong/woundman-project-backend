const express = require('express');
const paymentController = require('../controllers/paymentController');
const caseController = require('../controllers/caseController');

const router = express.Router();

router.route('/cases-no-receipt').get(paymentController.getCasesNoReceipt);

router
  .route('/cases-no-receipt/:id')
  .get(paymentController.getCaseNoReceiptById);

router.route('/cases/:id').get(caseController.getCaseById);

router
  .route('/payment-items')
  .get(paymentController.getPaymentItemsByPaymentType);

router
  .route('/cases-no-receipt/:id/payment')
  .post(paymentController.createPayment);

router
  .route('/cases-no-receipt/:id/payment')
  .get(paymentController.getPaymentsByType);

router
  .route('/cases-no-receipt/:caseId/payment/:paymentId')
  .patch(paymentController.updatePaymentsTypeServiceByPaymentId)
  .delete(paymentController.deletePaymentsTypeServiceByPaymentId);

module.exports = router;
