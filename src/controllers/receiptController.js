const { Receipt, Payment, sequelize, PaymentItem } = require('../models');
const AppError = require('../utils/appError');

exports.createReceiptByCaseId = async (req, res, next) => {
  let t;

  try {
    t = await sequelize.transaction();
    const { method, totalPrice } = req.body;
    const caseId = req.params.id;
    const staffId = req.user.id;

    const receipt = await Receipt.findOne(
      { where: { caseId } },
      { transaction: t }
    );
    if (receipt) {
      throw new AppError('Receipt already exists for this case', 400);
    }
    const newReceiptData = await Receipt.create(
      {
        method,
        totalPrice,
        staffId,
        caseId
      },
      { transaction: t }
    );

    const updatePayment = await Payment.findAll(
      { where: { caseId } },
      { transaction: t }
    );

    if (updatePayment && updatePayment.length > 0) {
      for (const payment of updatePayment) {
        await payment.update(
          { receiptId: newReceiptData.id },
          { transaction: t }
        );
      }
    } else {
      throw new AppError('Payment was not found', 400);
    }

    await t.commit();

    const newReceipt = await Receipt.findOne({
      where: { id: newReceiptData.id }
    });

    res.status(201).json({ newReceipt });
  } catch (err) {
    if (t) await t.rollback();
    next(err);
  }
};

exports.getReceiptByCaseId = async (req, res, next) => {
  try {
    const id = req.params.id;
    const caseIdNumber = parseInt(id, 10);

    const receiptData = await Receipt.findOne({
      where: { caseId: caseIdNumber },
      include: [
        {
          model: Payment,
          attributes: ['amount', 'price'],
          include: [
            {
              model: PaymentItem,
              attributes: ['title']
            }
          ]
        }
      ]
    });

    if (!receiptData) {
      res.status(200).json({ message: 'Receipt was not found', receipt: {} });
      return;
    }

    if (caseIdNumber !== receiptData.caseId) {
      console.log('caseIdNumber:', caseIdNumber);
      console.log('receiptData.caseId:', receiptData.caseId);
      throw new AppError('No permission to delete', 403);
    }

    res.status(200).json({ receipt: receiptData });
  } catch (err) {
    next(err);
  }
};

exports.deleteReceiptByCaseIdReceiptId = async (req, res, next) => {
  let t;

  try {
    t = await sequelize.transaction();
    const { caseId, receiptId } = req.params;

    const caseIdNumber = parseInt(caseId, 10);
    const receiptIdNumber = parseInt(receiptId, 10);

    const receiptData = await Receipt.findOne({
      where: { id: receiptIdNumber, caseId: caseIdNumber }
    });

    if (!receiptData) {
      throw new AppError('Receipt was not found', 400);
    }

    if (caseIdNumber !== receiptData.caseId) {
      console.log('caseIdNumber:', caseIdNumber);
      console.log('receiptData.caseId:', receiptData.caseId);
      throw new AppError('No permission to delete', 403);
    }

    await Payment.update(
      { receiptId: null },
      { where: { receiptId: receiptIdNumber }, transaction: t }
    );
    await Receipt.destroy({
      where: { id: receiptIdNumber, caseId: caseIdNumber },
      transaction: t
    });

    await t.commit();

    res.status(200).json({ message: 'Success delete' });
  } catch (err) {
    if (t) await t.rollback();
    next(err);
  }
};
