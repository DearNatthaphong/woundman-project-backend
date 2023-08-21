module.exports = (sequelize, DataTypes) => {
  const Treatment = sequelize.define(
    'Treatment',
    {
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      diagnosis: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      treatment: {
        type: DataTypes.STRING(1234),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      }
    },
    { underscored: true }
  );
  return Treatment;
};
