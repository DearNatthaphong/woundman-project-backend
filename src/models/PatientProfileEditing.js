module.exports = (sequelize, DataTypes) => {
  const PatientProfileEditing = sequelize.define(
    'PatientProfileEditing',
    {},
    { underscored: true }
  );
  return PatientProfileEditing;
};
