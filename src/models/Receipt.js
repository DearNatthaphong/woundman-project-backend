const {
  PAYMENT_CASH,
  PAYMENT_TRANSFER,
  PAYMENT_CARD
} = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const Receipt = sequelize.define(
    'Receipt',
    {
      totalPrice: {
        type: DataTypes.DECIMAL(7, 2),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      method: {
        type: DataTypes.ENUM(PAYMENT_CASH, PAYMENT_TRANSFER, PAYMENT_CARD),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      image: DataTypes.STRING
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

    Receipt.belongsTo(db.Case, {
      foreignKey: {
        name: 'caseId',
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
