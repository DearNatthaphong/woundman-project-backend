const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');
const { Staff } = require('../models');
const { Patient } = require('../models');

const passwordRegex = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{6,}$/;

function validatePassword(password) {
  return passwordRegex.test(password);
}
// const validatePassword = (password) => passwordRegex.test(password);

const genToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY || 'private_key', {
    expiresIn: process.env.JWT_EXPIRES || '1d'
  });

exports.staffRegister = async (req, res, next) => {
  try {
    const {
      titleName,
      firstName,
      lastName,
      role,
      emailOrMobile,
      password,
      confirmPassword,
      awareness
    } = req.body;

    if (!emailOrMobile) {
      // res.status(400).json({message:'email or mobile is required'})
      // next(new AppError('email or mobile is required', 400));
      throw new AppError('ต้องใช้อีเมลหรือเบอร์มือถือ', 400);
    }

    // validate email or mobile
    const isEmail = validator.isEmail(emailOrMobile + '');
    const isMobile = validator.isMobilePhone(emailOrMobile + '', 'th-TH');

    if (!isEmail && !isMobile) {
      throw new AppError('อีเมลหรือเบอร์มือถือไม่ถูกต้อง', 400);
    }

    if (!password) {
      throw new AppError('ต้องใช้รหัสผ่าน', 400);
    }

    // validate password
    const isPassword = validatePassword(password);

    if (!isPassword) {
      throw new AppError('รหัสผ่านไม่ถูกต้องตามที่กำหนด', 400);
    }

    if (password !== confirmPassword) {
      throw new AppError('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const staff = await Staff.create({
      titleName,
      firstName,
      lastName,
      role,
      awareness,
      email: isEmail ? emailOrMobile : null,
      mobile: isMobile ? emailOrMobile : null,
      password: hashedPassword
    });

    const token = genToken({ id: staff.id });
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.patientRegister = async (req, res, next) => {
  try {
    const {
      idCard,
      titleName,
      firstName,
      lastName,
      dateOfBirth,
      mobile,
      idLine,
      password,
      confirmPassword,
      consent
    } = req.body;

    if (!idCard) {
      throw new AppError('ต้องใช้เลขบัตรประชาชน13หลัก', 400);
    }

    const isIdCard = validator.isIdentityCard(idCard + '', 'TH');

    if (!isIdCard) {
      throw new AppError('เลขบัตรประชาชนไม่ถูกต้อง', 400);
    }

    if (!mobile) {
      throw new AppError('ต้องใช้เบอร์มือถือ', 400);
    }

    const isMobile = validator.isMobilePhone(mobile + '', 'th-TH');

    if (!isMobile) {
      throw new AppError('เบอร์มือถือไม่ถูกต้อง', 400);
    }

    if (!password) {
      throw new AppError('ต้องใช้รหัสผ่าน', 400);
    }

    const isPassword = validatePassword(password);

    if (!isPassword) {
      throw new AppError('รหัสผ่านไม่ถูกต้องตามที่กำหนด', 400);
    }

    if (password !== confirmPassword) {
      throw new AppError('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const patient = await Patient.create({
      titleName,
      firstName,
      lastName,
      dateOfBirth,
      idLine,
      consent,
      idCard: isIdCard ? idCard : null,
      mobile: isMobile ? mobile : null,
      password: hashedPassword
    });

    const token = genToken({ id: patient.id });
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};
