const validator = require('validator');
const AppError = require('../utils/appError');
const {
  Receipt,
  Case,
  Patient,
  Payment,
  PaymentItem,
  PaymentType
} = require('../models');
const { Op } = require('sequelize');

exports.getCasesNoReceipt = async (req, res, next) => {
  try {
    const casesNoReceipt = await Case.findAll({
      //   attributes: { exclude: ['staffId'] },
      //   include: [
      //     { model: Patient, attributes: { exclude: 'password' } },
      //     {
      //       model: Receipt,
      //       required: false,
      //       where: { id: null }
      //     }
      //   ],
      //   order: [['createdAt', 'DESC']]
      // });
      attributes: { exclude: ['staffId'] },
      where: { '$Receipt.id$': null },
      include: [
        { model: Patient, attributes: { exclude: 'password' } },
        {
          model: Receipt,
          required: false,
          as: 'Receipt'
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ casesData: casesNoReceipt });
  } catch (err) {
    next(err);
  }
};

exports.getCaseNoReceiptById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const caseId = parseInt(id, 10);

    const caseData = await Case.findOne({
      where: { id: caseId },
      attributes: { exclude: 'patientId' },
      include: [{ model: Patient, attributes: { exclude: 'password' } }],
      order: [['createdAt', 'DESC']]
    });

    if (!caseData) {
      throw new AppError('Case with the specified ID not found', 400);
    }

    res.status(200).json({ caseData });
  } catch (err) {
    next(err);
  }
};

exports.getPaymentItemsByPaymentType = async (req, res, next) => {
  try {
    const { paymentTypeTitle } = req.query;

    const paymentType = await PaymentType.findOne({
      where: { title: paymentTypeTitle }
    });

    const paymentItemsData = await PaymentItem.findAll({
      where: { paymentTypeId: paymentType.id }
    });

    // const paymentTypeItems = await PaymentItem.findAll({
    //   attributes: { exclude: ['paymentTypeId'] },
    //   include: [{ model: PaymentType, where: { title: paymentTypeTitle } }],
    //   order: [['createdAt', 'DESC']]
    // });

    if (paymentItemsData.length === 0) {
      return res
        .status(404)
        .json({ message: 'No matching paymentItems found.' });
    }

    res.status(200).json({ paymentItems: paymentItemsData });
  } catch (err) {
    next(err);
  }
};

exports.createPayment = async (req, res, next) => {
  try {
    const { amount } = req.body;

    const { paymentItemTitle } = req.query;

    const isNumber = validator.isNumeric(amount + '');

    if (!amount || !isNumber || !paymentItemTitle || !paymentItemTitle.trim()) {
      throw new AppError('ข้อมูลไม่ครบหรือข้อมูลไม่ถูกต้อง', 400);
    }

    const { id } = req.params;
    const caseId = parseInt(id, 10);
    const receiptId = null;
    const data = { caseId };

    if (amount && isNumber) {
      data.amount = amount;
    }

    if (paymentItemTitle && paymentItemTitle.trim()) {
      const paymentItem = await PaymentItem.findOne({
        where: { title: paymentItemTitle }
      });

      if (!paymentItem) {
        throw new AppError('PaymentItem not found', 400);
      }

      if (paymentItem) {
        data.paymentItemId = paymentItem.id;
        const calculatePrice = amount * paymentItem.price;
        data.price = calculatePrice;
      }
    }

    const newPaymentData = await Payment.create({
      ...data,
      receiptId
    });

    const newPayment = await Payment.findOne({
      where: { id: newPaymentData.id },
      include: PaymentItem
    });

    res.status(201).json({ newPayment });
  } catch (err) {
    next(err);
  }
};

exports.getPaymentsByType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const caseId = parseInt(id, 10);
    const { paymentTypeTitle } = req.query;

    const paymentType = await PaymentType.findOne({
      where: { title: paymentTypeTitle }
    });

    const paymentItems = await PaymentItem.findAll({
      where: { paymentTypeId: paymentType.id }
    });

    const itemsTitleArray = paymentItems.map((item) => item.title);

    const payments = await Payment.findAll({
      where: {
        caseId
      },
      // attributes: { exclude: ['paymentItemId'] },
      include: [
        {
          model: PaymentItem,
          where: { title: itemsTitleArray },
          attributes: ['title']
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    if (payments.length === 0) {
      return res.status(404).json({ message: 'No matching payment found.' });
    }

    res.status(200).json({ paymentsByType: payments });
  } catch (err) {
    next(err);
  }
};

exports.deletePaymentsTypeServiceByPaymentId = async (req, res, next) => {
  try {
    const { caseId, paymentId } = req.params;

    const caseIdNumber = parseInt(caseId, 10);
    const paymentIdNumber = parseInt(paymentId, 10);

    const paymentData = await Payment.findOne({
      where: { id: paymentIdNumber }
    });

    if (!paymentData) {
      throw new AppError('Payment was not found', 400);
    }

    if (caseIdNumber !== paymentData.caseId) {
      console.log('caseIdNumber:', caseIdNumber);
      console.log('paymentData.caseId:', paymentData.caseId);
      throw new AppError('No permission to delete', 403);
    }

    await Payment.destroy({ where: { id: paymentData.id } });

    res.status(200).json({ message: 'Success delete' });
  } catch (err) {
    next(err);
  }
};

exports.updatePaymentsTypeServiceByPaymentId = async (req, res, next) => {
  try {
    const { amount } = req.body;

    const { paymentItemTitle } = req.query;

    const isNumber = validator.isNumeric(amount + '');

    if (!amount || !isNumber || !paymentItemTitle || !paymentItemTitle.trim()) {
      throw new AppError('ข้อมูลไม่ครบหรือข้อมูลไม่ถูกต้อง', 400);
    }

    const { caseId, paymentId } = req.params;
    const caseIdNumber = parseInt(caseId, 10);
    const paymentIdNumber = parseInt(paymentId, 10);
    // const receiptId = null;
    const updatedData = { caseIdNumber };

    if (amount && isNumber) {
      updatedData.amount = amount;
    }

    if (paymentItemTitle && paymentItemTitle.trim()) {
      const paymentItem = await PaymentItem.findOne({
        where: { title: paymentItemTitle }
      });

      if (!paymentItem) {
        throw new AppError('PaymentItem not found', 400);
      }

      if (paymentItem) {
        updatedData.paymentItemId = paymentItem.id;
        const calculatePrice = amount * paymentItem.price;
        updatedData.price = calculatePrice;
      }
    }

    const updatedPayment = await Payment.update(updatedData, {
      where: { [Op.and]: [{ id: paymentIdNumber }, { caseId: caseIdNumber }] }
    });

    if (!updatedPayment) {
      throw new AppError('Payment not found or could not be updated', 400);
    }

    const updatedPaymentData = await Payment.findOne({
      where: { id: paymentIdNumber },
      include: PaymentItem
    });

    res.status(200).json({ updatedPayment: updatedPaymentData });
  } catch (err) {
    next(err);
  }
};
