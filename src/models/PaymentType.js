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

  PaymentType.associate = (db) => {
    PaymentType.hasMany(db.PaymentItem, {
      foreignKey: {
        name: 'paymentTypeId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };
  return PaymentType;
};
