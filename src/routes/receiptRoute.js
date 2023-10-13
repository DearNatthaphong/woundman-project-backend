const express = require('express');
const receiptController = require('../controllers/receiptController');

const router = express.Router();

router.route('/cases/:id').post(receiptController.createReceiptByCaseId);

module.exports = router;
