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
  return PaymentItem;
};
