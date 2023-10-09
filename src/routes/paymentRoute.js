const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.route('/cases-no-receipt').get(paymentController.getCasesNoReceipt);

router
  .route('/cases-no-receipt/:id')
  .get(paymentController.getCaseNoReceiptById);

router
  .route('/payment-items')
  .get(paymentController.getPaymentItemsByPaymentType);

router
  .route('/cases-no-receipt/:id/payment')
  .post(paymentController.createPaymentTypeService);

module.exports = router;
