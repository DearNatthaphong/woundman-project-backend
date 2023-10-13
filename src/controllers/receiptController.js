const { Receipt, Payment } = require('../models');
const AppError = require('../utils/appError');

exports.createReceiptByCaseId = async (req, res, next) => {
  try {
    const { method, totalPrice } = req.body;
    const caseId = req.params.id;
    const staffId = req.user.id;

    const receipt = await Receipt.findOne({ where: { caseId } });
    if (receipt) {
      throw new AppError('Receipt already exists for this case', 400);
    }
    const newReceiptData = await Receipt.create({
      method,
      totalPrice,
      staffId,
      caseId
    });

    const updatePayment = await Payment.findAll({ where: { caseId } });

    if (updatePayment && updatePayment.length > 0) {
      for (const payment of updatePayment) {
        await payment.update({ receiptId: newReceiptData.id });
      }
    } else {
      throw new AppError('Payment was not found', 400);
    }

    const newReceipt = await Receipt.findOne({
      where: { id: newReceiptData.id }
    });

    res.status(201).json({ newReceipt });
  } catch (err) {
    next(err);
  }
};

exports.getReceiptByCaseId = async (req, res, next) => {
  try {
    const caseId = req.params;
    const receiptData = await Receipt.findOne({ where: { id: caseId } });

    res.status(200).json({ receipt: receiptData });
  } catch (err) {
    next(err);
  }
};

exports.deleteReceiptByCaseId = async (req, rex, next) => {
  try {
    const { caseId, receiptId } = req.params;

    const caseIdNumber = parseInt(caseId, 10);
    const receiptIdNumber = parseInt(receiptId, 10);

    const receiptData = await Receipt.findOne({
      where: { id: receiptIdNumber }
    });

    if (!receiptData) {
      throw new AppError('Receipt was not found', 400);
    }

    if (caseIdNumber !== receiptData.caseId) {
      console.log('caseIdNumber:', caseIdNumber);
      console.log('receiptData.caseId:', receiptData.caseId);
      throw new AppError('No permission to delete', 403);
    }

    await Receipt.destroy({ where: { id: receiptData.id } });

    res.status(200).json({ message: 'Success delete' });
  } catch (err) {
    next(err);
  }
};
