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

  Treatment.associate = (db) => {
    Treatment.belongsTo(db.Staff, {
      foreignKey: {
        name: 'staffId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    Treatment.belongsTo(db.Case, {
      foreignKey: {
        name: 'caseId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };

  return Treatment;
};
