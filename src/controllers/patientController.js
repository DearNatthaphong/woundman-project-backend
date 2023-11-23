const fs = require('fs');
const { Patient, PatientProfileEditing, Staff } = require('../models');
const cloudinary = require('../utils/cloudinary');
const AppError = require('../utils/appError');
const { Op } = require('sequelize');

exports.updatePatient = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const staffId = req.user.id;

    const {
      idCard,
      titleName,
      firstName,
      lastName,
      dateOfBirth,
      mobile,
      idLine,
      password,
      ...updateValue
    } = req.body;

    const patient = await Patient.findOne({
      where: { id: patientId },
      attributes: { exclude: 'password' }
    });

    if (req.file) {
      // const profileImage = patient.profileImage;
      const currentProfileImage = patient.profileImage;

      const secureUrl = await cloudinary.upload(
        // req.files.profileImage[0].path,
        req.file.path,
        currentProfileImage
          ? cloudinary.getPublicId(currentProfileImage)
          : undefined
      );

      updateValue.profileImage = secureUrl;
      // fs.unlinkSync(req.files.profileImage[0].path);
    }

    if (idCard) {
      updateValue.idCard = idCard;
    }
    if (titleName) {
      updateValue.titleName = titleName;
    }

    if (firstName) {
      updateValue.firstName = firstName;
    }

    if (lastName) {
      updateValue.lastName = lastName;
    }

    if (dateOfBirth) {
      updateValue.dateOfBirth = dateOfBirth;
    }

    if (mobile) {
      updateValue.mobile = mobile;
    }

    if (idLine) {
      updateValue.idLine = idLine;
    }

    // if (password) {
    //   updateValue.password = password;
    // }

    await Patient.update(updateValue, { where: { id: patientId } });

    const newEditing = await PatientProfileEditing.create({
      editorId: staffId,
      editedId: patientId
    });

    // const patientIdInt = parseInt(patientId, 10);
    // const staffIdInt = parseInt(staffId, 10);

    // await PatientProfileEditing.create({
    //   editorId: staffIdInt,
    //   editedId: patientIdInt
    // });

    const newPatient = await Patient.findOne({
      where: { id: patientId },
      attributes: { exclude: 'password' },
      include: [
        {
          model: PatientProfileEditing,
          as: 'Edited',
          include: [
            {
              model: Staff,
              as: 'Editor',
              attributes: { exclude: 'password' }
            }
          ],
          order: [['createdAt', 'DESC']],
          limit: 1
        }
      ]
    });

    res.status(200).json({ patient: newPatient });

    // console.log(req.files);
    // res.status(200).json('success');
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.getSearchPatients = async (req, res, next) => {
  try {
    const { searchTerm } = req.query;

    let patients;

    if (!searchTerm) {
      patients = await Patient.findAll({
        attributes: { exclude: 'password' },
        order: [['createdAt', 'DESC']]
      });
    } else {
      patients = await Patient.findAll({
        where: {
          [Op.or]: [
            {
              firstName: {
                [Op.like]: `%${searchTerm}%`
              }
            },
            {
              lastName: {
                [Op.like]: `%${searchTerm}%`
              }
            }
          ]
        },
        attributes: { exclude: 'password' },
        order: [['createdAt', 'DESC']]
      });
    }

    if (patients.length === 0) {
      return res
        .status(200)
        .json({ message: 'No patients data found', patients: [] });
    }

    res.status(200).json({ patients });
  } catch (err) {
    next(err);
  }
};

exports.getAllPatients = async (req, res, next) => {
  try {
    const patients = await Patient.findAll({
      attributes: { exclude: 'password' },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ patients });
  } catch (err) {
    next(err);
  }
};

exports.getPatientById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findOne({
      where: { id },
      attributes: { exclude: 'password' },
      include: [
        {
          model: PatientProfileEditing,
          as: 'Edited',
          include: [
            {
              model: Staff,
              as: 'Editor',
              attributes: { exclude: 'password' }
            }
          ],
          order: [['createdAt', 'DESC']],
          limit: 1
        }
      ]
    });

    if (!patient) {
      throw new AppError('patient not found', 400);
    }

    res.status(200).json({ patient });
  } catch (err) {
    next(err);
  }
};
