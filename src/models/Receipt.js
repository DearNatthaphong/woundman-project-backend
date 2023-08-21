const {
  PAYMENT_CASH,
  PAYMENT_TRANSFER,
  PAYMENT_CARD
} = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const Receipt = sequelize.define(
    'Receipt',
    {
      method: {
        type: DataTypes.ENUM(PAYMENT_CASH, PAYMENT_TRANSFER, PAYMENT_CARD),
        allowNull: false,
        defaultValue: PAYMENT_CASH
      }
    },
    { underscored: true }
  );
  return Receipt;
};
