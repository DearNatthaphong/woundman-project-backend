module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    'Payment',
    {
      amount: {
        type: DataTypes.INTEGER(3),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      price: {
        type: DataTypes.DECIMAL(7, 2),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      }
    },
    { underscored: true }
  );

  Payment.associate = (db) => {
    Payment.belongsTo(db.Case, {
      foreignKey: {
        name: 'caseId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    Payment.belongsTo(db.Receipt, {
      foreignKey: {
        name: 'receiptId',
        allowNull: true // Allow initial value to be null
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE' // Update to null if the referenced receipt is updated
    });
    Payment.belongsTo(db.PaymentItem, {
      foreignKey: {
        name: 'paymentItemId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };
  return Payment;
};
