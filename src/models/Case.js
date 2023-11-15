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
        type: DataTypes.STRING(1234),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      height: {
        type: DataTypes.DECIMAL(4, 1),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      weight: {
        type: DataTypes.DECIMAL(4, 1),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      temperature: {
        type: DataTypes.DECIMAL(3, 1),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      // Rename bloodPressure to systolicBloodPressure
      systolicBloodPressure: {
        type: DataTypes.INTEGER(3),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      // New column diastolicBloodPressure
      diastolicBloodPressure: {
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

  Case.associate = (db) => {
    Case.belongsTo(db.Staff, {
      foreignKey: {
        name: 'staffId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    Case.belongsTo(db.Patient, {
      // as: 'Patient',
      foreignKey: {
        name: 'patientId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    Case.hasMany(db.Treatment, {
      foreignKey: {
        name: 'caseId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    Case.hasMany(db.Payment, {
      foreignKey: {
        name: 'caseId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    Case.hasOne(db.Appointment, {
      foreignKey: {
        name: 'caseId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    Case.hasOne(db.Receipt, {
      foreignKey: {
        name: 'caseId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };

  return Case;
};
