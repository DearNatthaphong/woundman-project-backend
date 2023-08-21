module.exports = (sequelize, DataTypes) => {
  const PaymentType = sequelize.define(
    'PaymentType',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      }
    },
    { underscored: true }
  );
  return PaymentType;
};
