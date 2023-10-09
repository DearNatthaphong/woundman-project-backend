const {
  Receipt,
  Case,
  Patient,
  PaymentItem,
  PaymentType
} = require('../models');

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

    res.status(200).json({ paymentItems: paymentTypeItems });
  } catch (err) {
    next(err);
  }
};
