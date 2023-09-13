const fs = require('fs');
const { Patient, PatientProfileEditing } = require('../models');
const cloudinary = require('../utils/cloudinary');

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

    if (req.files && req.files.profileImage) {
      const profileImage = req.user.profileImage;

      const secureUrl = await cloudinary.upload(
        req.files.profileImage[0].path,
        profileImage ? cloudinary.getPublicId(profileImage) : undefined
      );
      updateValue.profileImage = secureUrl;
      fs.unlinkSync(req.files.profileImage[0].path);
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

    if (password) {
      updateValue.password = password;
    }

    await Patient.update(updateValue, { where: { id: patientId } });

    await PatientProfileEditing.create({
      editorId: staffId,
      editedId: patientId
    });

    const patient = await Patient.findOne({
      where: { id: patientId },
      attributes: { exclude: 'password' }
    });

    res.status(200).json({ patient });

    // console.log(req.files);
    // res.status(200).json('success');
  } catch (err) {
    next(err);
  }
};
