const AppError = require('../utils/appError');
const { Case, Staff, Patient } = require('../models');

exports.createCase = async (req, res, next) => {
  try {
    const {
      chiefComplain,
      presentIllness,
      pastHistory,
      height,
      weight,
      temperature,
      systolicBloodPressure,
      diastolicBloodPressure,
      bloodOxygen
    } = req.body;

    if (
      !chiefComplain ||
      !chiefComplain.trim() ||
      !presentIllness ||
      !presentIllness.trim() ||
      !pastHistory ||
      !pastHistory.trim() ||
      !height ||
      !weight ||
      !temperature ||
      !systolicBloodPressure ||
      !diastolicBloodPressure ||
      !bloodOxygen
    ) {
      throw new AppError('ข้อมูลไม่ครบ', 400);
    }

    const { id } = req.params;
    const staffId = req.user.id;
    const patientId = parseInt(id, 10);
    const data = { patientId };

    if (chiefComplain && chiefComplain.trim()) {
      data.chiefComplain = chiefComplain;
    }
    if (presentIllness && presentIllness.trim()) {
      data.presentIllness = presentIllness;
    }
    if (pastHistory && pastHistory.trim()) {
      data.pastHistory = pastHistory;
    }
    if (height) {
      data.height = height;
    }
    if (weight) {
      data.weight = weight;
    }
    if (temperature) {
      data.temperature = temperature;
    }
    if (systolicBloodPressure) {
      data.systolicBloodPressure = systolicBloodPressure;
    }
    if (diastolicBloodPressure) {
      data.diastolicBloodPressure = diastolicBloodPressure;
    }
    if (bloodOxygen) {
      data.bloodOxygen = bloodOxygen;
    }

    const newCaseData = await Case.create({
      ...data,
      staffId
    });

    const newCase = await Case.findOne({
      where: { id: newCaseData.id },
      attributes: { exclude: ['staffId', 'patientId'] },
      include: [
        { model: Staff, attributes: { exclude: 'password' } },
        { model: Patient, attributes: { exclude: 'password' } }
      ]
    });

    res.status(201).json({ newCase });
  } catch (err) {
    next(err);
  }
};
