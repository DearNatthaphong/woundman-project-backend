const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');
const { Staff, Patient } = require('../models');
// const { Op } = require('sequelize');
// const { Staff } = require('../models/Staff');
// const { Patient } = require('../models/Patient');

exports.authorizeStaff = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new AppError('ไม่ได้รับอนุญาต 1', 401);
    }
    if (!authorization.startsWith('Bearer')) {
      throw new AppError('ไม่ได้รับอนุญาต 2', 401);
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      throw new AppError('ไม่ได้รับอนุญาต 3', 401);
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || 'private_key'
    );

    const staff = await Staff.findOne({
      where: { id: payload.id },
      attributes: { exclude: 'password' }
    });

    if (!staff) {
      throw new AppError('ไม่ได้รับอนุญาต 4', 401);
    }

    req.user = staff;
    next();
  } catch (err) {
    next(err); // ส่งไปที่ middlewares error
  }
};

exports.authorizePatient = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new AppError('ไม่ได้รับอนุญาต 1', 401);
    }
    if (!authorization.startsWith('Bearer')) {
      throw new AppError('ไม่ได้รับอนุญาต 2', 401);
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      throw new AppError('ไม่ได้รับอนุญาต 3', 401);
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || 'private_key'
    );

    const patient = await Patient.findOne({
      where: { id: payload.id },

      attributes: { exclude: 'password' }
    });
    if (!patient) {
      throw new AppError('ไม่ได้รับอนุญาต 4', 401);
    }

    req.user = patient;
    next();
  } catch (err) {
    next(err); // ส่งไปที่ middlewares error
  }
};
