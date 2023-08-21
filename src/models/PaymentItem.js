module.exports = (sequelize, DataTypes) => {
  const PaymentItem = sequelize.define(
    'PaymentItem',
    {
      name: {
        type: DataTypes.STRING,
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
  PaymentItem.associate = (db) => {
    PaymentItem.belongsTo(db.PaymentType, {
      foreignKey: {
        name: 'paymentTypeId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    PaymentItem.hasMany(db.Payment, {
      foreignKey: {
        name: 'paymentItemId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };
  return PaymentItem;
};
