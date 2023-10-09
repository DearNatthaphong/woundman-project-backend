const { Receipt, Case, Staff } = require('../models');

exports.getCasesNoReceipt = async (req, res, next) => {
  try {
    const casesNoReceipt = await Case.findAll({
      attributes: { exclude: ['staffId'] },

      include: [
        { model: Staff, attributes: { exclude: 'password' } },
        {
          model: Receipt,
          required: false,
          where: { id: null }
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ cases: casesNoReceipt });
  } catch (err) {
    next(err);
  }
};
