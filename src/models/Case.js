module.exports = (sequelize, DataTypes) => {
  const Case = sequelize.define(
    'Case',
    {
      chiefComplain: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      presentIllness: {
        type: DataTypes.STRING(1234),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      pastHistory: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      height: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      weight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      temperature: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      bloodPressure: {
        type: DataTypes.INTEGER(3),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      bloodOxygen: {
        type: DataTypes.INTEGER(3),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      }
    },
    { underscored: true }
  );
  return Case;
};
