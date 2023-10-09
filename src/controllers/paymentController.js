const validator = require('validator');
const {
  Receipt,
  Case,
  Patient,
  Payment,
  PaymentItem,
  PaymentType
} = require('../models');
const AppError = require('../utils/appError');

exports.getCasesNoReceipt = async (req, res, next) => {
  try {
    const casesNoReceipt = await Case.findAll({
      attributes: { exclude: ['staffId'] },

      include: [
        { model: Patient, attributes: { exclude: 'password' } },
        {
          model: Receipt,
          required: false,
          where: { id: null }
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
    const paymentTypeItems = await PaymentItem.findAll({
      attributes: { exclude: ['paymentTypeId'] },
      include: [{ model: PaymentType, where: { title: paymentTypeTitle } }],
      order: [['createdAt', 'DESC']]
    });

    if (paymentTypeItems.length === 0) {
      return res
        .status(404)
        .json({ message: 'No matching paymentItems found.' });
    }

    res.status(200).json({ paymentItemsService: paymentTypeItems });
  } catch (err) {
    next(err);
  }
};

exports.createPaymentTypeService = async (req, res, next) => {
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
      where: { id: newPaymentData.id }
    });

    res.status(201).json({ newPayment });
  } catch (err) {
    next(err);
  }
};
