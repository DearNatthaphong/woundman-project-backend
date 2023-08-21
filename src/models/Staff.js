const {
  TITLE_NAME_MR,
  TITLE_NAME_MRS,
  TITLE_NAME_MISS,
  ROLE_ADMIN,
  ROLE_NURSE,
  ROLE_DOCTOR
} = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const Staff = sequelize.define(
    'Staff',
    {
      titleName: {
        type: DataTypes.ENUM(TITLE_NAME_MR, TITLE_NAME_MISS, TITLE_NAME_MRS),
        allowNull: false,
        defaultValue: TITLE_NAME_MR
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
      role: {
        type: DataTypes.ENUM(ROLE_ADMIN, ROLE_NURSE, ROLE_DOCTOR),
        allowNull: false,
        defaultValue: ROLE_ADMIN
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      mobile: {
        type: DataTypes.STRING,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      awareness: {
        tye: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      profileImage: DataTypes.STRING
    },
    { underscored: true }
  );

  return Staff;
};
