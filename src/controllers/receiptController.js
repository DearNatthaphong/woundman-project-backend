const {
  Receipt,
  Payment,
  sequelize,
  PaymentItem,
  Patient,
  Case,
  Staff
} = require('../models');
const AppError = require('../utils/appError');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');

exports.createReceiptByCaseId = async (req, res, next) => {
  let t;

  try {
    t = await sequelize.transaction();

    const { method, totalPrice, image, ...data } = req.body;
    const caseId = req.params.id;
    const staffId = req.user.id;

    if (!method || !totalPrice) {
      throw new AppError('ข้อมูลไม่ครบ', 400);
    }

    if (method) {
      data.method = method;
    }

    if (totalPrice) {
      data.totalPrice = totalPrice;
    }

    if (req.file) {
      data.image = await cloudinary.upload(req.file.path);
    }

    const receipt = await Receipt.findOne(
      { where: { caseId } },
      { transaction: t }
    );
    if (receipt) {
      throw new AppError('มีใบเสร็จแล้ว', 400);
    }

    const newReceiptData = await Receipt.create(
      {
        ...data,
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
      throw new AppError('ไม่พบการทำจ่าย', 400);
    }

    await t.commit();

    const newReceipt = await Receipt.findOne({
      where: { id: newReceiptData.id },
      attributes: { exclude: ['paymentId', 'staffId'] },
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
        },
        { model: Staff, attributes: { exclude: 'password' } }
      ]
    });

    res.status(201).json({ newReceipt });
  } catch (err) {
    if (t) await t.rollback();
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.getReceiptByCaseId = async (req, res, next) => {
  try {
    const id = req.params.id;
    const caseIdNumber = parseInt(id, 10);

    const receiptData = await Receipt.findAll({
      where: { caseId: caseIdNumber },
      attributes: { exclude: ['paymentId', 'staffId'] },
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
        },
        { model: Staff, attributes: { exclude: 'password' } }
      ]
    });

    if (!receiptData) {
      throw new AppError('Receipt not found', 400);
      // res.status(200).json({ message: 'Receipt was not found', receipt: {} });
      // return;
    }

    // if (caseIdNumber !== receiptData.caseId) {
    //   console.log('caseIdNumber:', caseIdNumber);
    //   console.log('receiptData.caseId:', receiptData.caseId);
    //   throw new AppError('No permission', 403);
    // }

    res.status(200).json({ receipts: receiptData });
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

exports.getReceiptsByPatientId = async (req, res, next) => {
  try {
    const patientId = req.user.id;

    const receiptsData = await Receipt.findAll({
      attibutes: { exclude: ['caseId', 'staffId'] },
      include: [
        {
          model: Case,
          where: { patientId },
          attributes: ['chiefComplain'],
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
        },
        { model: Staff, attributes: { exclude: 'password' } }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ receipts: receiptsData });
  } catch (err) {
    next(err);
  }
};
