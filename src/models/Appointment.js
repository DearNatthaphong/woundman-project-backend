const {
  APPOINTMENT_UPCOMING,
  APPOINTMENT_PAST,
  APPOINTMENT_CANCEL
} = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define(
    'Appointment',
    {
      reason: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      appointmentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      status: {
        type: DataTypes.ENUM(
          APPOINTMENT_UPCOMING,
          APPOINTMENT_PAST,
          APPOINTMENT_CANCEL
        ),
        allowNull: false,
        defaultValue: APPOINTMENT_UPCOMING
      }
    },
    { underscored: true }
  );

  Appointment.associate = (db) => {
    Appointment.belongsTo(db.Staff, {
      foreignKey: {
        name: 'staffId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    Appointment.belongsTo(db.Case, {
      foreignKey: {
        name: 'caseId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };
  return Appointment;
};
