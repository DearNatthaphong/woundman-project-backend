const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');
const appValidate = require('../utils/appValidate');
const { Staff } = require('../models');
const { Patient } = require('../models');
const { Op } = require('sequelize');

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
    const isPassword = appValidate.validatePassword(password);

    if (password && !isPassword) {
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

    if (idCard && !isIdCard) {
      throw new AppError('เลขบัตรประชาชนไม่ถูกต้อง', 400);
    }

    if (!mobile) {
      throw new AppError('ต้องใช้เบอร์มือถือ', 400);
    }

    const isMobile = validator.isMobilePhone(mobile + '', 'th-TH');

    if (mobile && !isMobile) {
      throw new AppError('เบอร์มือถือไม่ถูกต้อง', 400);
    }

    if (!password) {
      throw new AppError('ต้องใช้รหัสผ่าน', 400);
    }

    const isPassword = appValidate.validatePassword(password);

    if (password && !isPassword) {
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

exports.patientLogin = async (req, res, next) => {
  try {
    const { idCard, password } = req.body;

    if (typeof idCard !== 'string' || typeof password !== 'string') {
      throw new AppError('เลขบัตรประชาชนหรือรหัสผ่านผิดพลาด', 400);
    }

    // SELECT * FROM users WHERE idCard = idCard
    const patient = await Patient.findOne({
      where: { idCard: idCard }
    });

    if (!patient) {
      throw new AppError('เลขบัตรประชาชนหรือรหัสผ่านผิดพลาด', 400);
    }

    const isCorrect = await bcrypt.compare(password, patient.password);

    if (!isCorrect) {
      throw new AppError('เลขบัตรประชาชนหรือรหัสผ่านผิดพลาด', 400);
    }

    const token = genToken({ id: patient.id });
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.staffLogin = async (req, res, next) => {
  try {
    const { emailOrMobile, password } = req.body;

    // if (!emailOrMobile || typeof emailOrMobile !== 'string') {
    if (typeof emailOrMobile !== 'string' || typeof password !== 'string') {
      throw new AppError('อีเมลหรือเบอร์มือถือหรือรหัสผ่านผิดพลาด', 400);
    }

    // SELECT * FROM users WHERE email = emailOrMobile OR mobile = emailOrMobile
    const staff = await Staff.findOne({
      where: {
        [Op.or]: [{ email: emailOrMobile }, { mobile: emailOrMobile }]
      }
    });

    if (!staff) {
      throw new AppError('อีเมลหรือเบอร์มือถือหรือรหัสผ่านผิดพลาด', 400);
    }

    const isCorrect = await bcrypt.compare(password, staff.password);

    if (!isCorrect) {
      throw new AppError('อีเมลหรือเบอร์มือถือหรือรหัสผ่านผิดพลาด', 400);
    }

    const token = genToken({ id: staff.id });
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};
