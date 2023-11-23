const {
  TITLE_NAME_ฺBOY,
  TITLE_NAME_ฺGIRL,
  TITLE_NAME_MR,
  TITLE_NAME_MRS,
  TITLE_NAME_MISS
} = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const Patient = sequelize.define(
    'Patient',
    {
      titleName: {
        type: DataTypes.ENUM(
          TITLE_NAME_ฺBOY,
          TITLE_NAME_ฺGIRL,
          TITLE_NAME_MR,
          TITLE_NAME_MISS,
          TITLE_NAME_MRS
        ),
        allowNull: false,
        // defaultValue: TITLE_NAME_ฺBOY
        validate: {
          notEmpty: true
        }
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      idCard: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      mobile: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      idLine: {
        type: DataTypes.STRING,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      consent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        // defaultValue: false
        validate: {
          notEmpty: true
        }
      },
      profileImage: DataTypes.STRING
    },
    { underscored: true }
  );

  Patient.associate = (db) => {
    Patient.hasMany(db.Case, {
      foreignKey: {
        name: 'patientId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    Patient.hasMany(db.PatientProfileEditing, {
      as: 'Edited',
      foreignKey: {
        name: 'editedId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };

  return Patient;
};
