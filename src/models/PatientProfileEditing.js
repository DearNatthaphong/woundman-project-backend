module.exports = (sequelize, DataTypes) => {
  const PatientProfileEditing = sequelize.define(
    'PatientProfileEditing',
    {},
    { underscored: true }
  );

  PatientProfileEditing.associate = (db) => {
    PatientProfileEditing.belongsTo(db.Staff, {
      as: 'Editor',
      foreignKey: {
        name: 'editorId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    PatientProfileEditing.belongsTo(db.Patient, {
      as: 'Edited',
      foreignKey: {
        name: 'editedId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };
  return PatientProfileEditing;
};
