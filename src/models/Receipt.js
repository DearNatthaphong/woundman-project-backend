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

  Receipt.associate = (db) => {
    Receipt.belongsTo(db.Staff, {
      foreignKey: {
        name: 'staffId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    Receipt.hasMany(db.Payment, {
      foreignKey: {
        name: 'receiptId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };
  return Receipt;
};
