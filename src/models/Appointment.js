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
  return Appointment;
};
