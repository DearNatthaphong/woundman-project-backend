const fs = require('fs');
const cloudinary = require('../utils/cloudinary');
const { Staff } = require('../models');

exports.updateStaff = async (req, res, next) => {
  try {
    // if (req.files.profileImage) {
    //   // console.log(req.files);
    //   const secureUrl = await cloudinary.upload(req.files.profileImage[0].path);
    //   await Staff.update({profileImage:secureUrl}, {where: {id: req.user.id}})
    // }

    // const updateValue = {};

    // const updateValue = { ...req.body };
    // validate **********************************

    // const { password, ...updateValue } = req.body;
    const {
      titleName,
      firstName,
      lastName,
      role,
      mobile,
      email,
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

    if (titleName) {
      updateValue.titleName = titleName;
    }

    if (firstName) {
      updateValue.firstName = firstName;
    }

    if (lastName) {
      updateValue.lastName = lastName;
    }

    if (role) {
      updateValue.role = role;
    }

    if (mobile) {
      updateValue.mobile = mobile;
    }

    if (email) {
      updateValue.email = email;
    }

    if (password) {
      updateValue.password = password;
    }

    await Staff.update(updateValue, { where: { id: req.user.id } });

    // await req.user.reload(); // ติด password มาด้วย เหมือน select *
    // res.status(200).json({ staff: req.user });

    const staff = await Staff.findOne({
      where: { id: req.user.id },
      attributes: { exclude: 'password' }
    });

    res.status(200).json({ staff });
  } catch (err) {
    next(err);
  }
};
