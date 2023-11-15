const AppError = require('../utils/appError');
const {
  Case,
  Staff,
  Patient,
  sequelize,
  Appointment,
  Payment,
  Treatment,
  Receipt
} = require('../models');
const { Op } = require('sequelize');

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

exports.getCasesByPatientId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findOne({ where: { id } });
    if (!patient) {
      throw new AppError('Patient not found', 400);
    }

    const cases = await Case.findAll({
      where: { patientId: id },
      attributes: { exclude: ['staffId', 'patientId'] },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ cases });
  } catch (err) {
    next(err);
  }
};

exports.updateCaseByPatientId = async (req, res, next) => {
  try {
    const { patientId, caseId } = req.params;
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

    const updatedData = {};

    if (chiefComplain && chiefComplain.trim()) {
      updatedData.chiefComplain = chiefComplain;
    }
    if (presentIllness && presentIllness.trim()) {
      updatedData.presentIllness = presentIllness;
    }
    if (pastHistory && pastHistory.trim()) {
      updatedData.pastHistory = pastHistory;
    }
    if (height) {
      updatedData.height = height;
    }
    if (weight) {
      updatedData.weight = weight;
    }
    if (temperature) {
      updatedData.temperature = temperature;
    }
    if (systolicBloodPressure) {
      updatedData.systolicBloodPressure = systolicBloodPressure;
    }
    if (diastolicBloodPressure) {
      updatedData.diastolicBloodPressure = diastolicBloodPressure;
    }
    if (bloodOxygen) {
      updatedData.bloodOxygen = bloodOxygen;
    }

    const updatedCase = await Case.update(updatedData, {
      where: { patientId, id: caseId }
    });

    if (!updatedCase) {
      throw new AppError('Case not found or could not be updated', 400);
    }

    const updatedCaseData = await Case.findOne({
      where: { id: caseId },
      attributes: { exclude: ['staffId', 'patientId'] },
      include: [
        { model: Staff, attributes: { exclude: 'password' } },
        { model: Patient, attributes: { exclude: 'password' } }
      ]
    });

    res.status(200).json({ updatedCase: updatedCaseData });
  } catch (err) {
    next(err);
  }
};

exports.updateCaseByCaseId = async (req, res, next) => {
  try {
    const { id } = req.params;
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

    const updatedData = {};

    if (chiefComplain && chiefComplain.trim()) {
      updatedData.chiefComplain = chiefComplain;
    }
    if (presentIllness && presentIllness.trim()) {
      updatedData.presentIllness = presentIllness;
    }
    if (pastHistory && pastHistory.trim()) {
      updatedData.pastHistory = pastHistory;
    }
    if (height) {
      updatedData.height = height;
    }
    if (weight) {
      updatedData.weight = weight;
    }
    if (temperature) {
      updatedData.temperature = temperature;
    }
    if (systolicBloodPressure) {
      updatedData.systolicBloodPressure = systolicBloodPressure;
    }
    if (diastolicBloodPressure) {
      updatedData.diastolicBloodPressure = diastolicBloodPressure;
    }
    if (bloodOxygen) {
      updatedData.bloodOxygen = bloodOxygen;
    }

    const updatedCase = await Case.update(updatedData, {
      where: { id }
    });

    if (!updatedCase) {
      throw new AppError('Case not found or could not be updated', 400);
    }

    const updatedCaseData = await Case.findOne({
      where: { id },
      attributes: { exclude: ['staffId', 'patientId'] },
      include: [
        { model: Staff, attributes: { exclude: 'password' } },
        { model: Patient, attributes: { exclude: 'password' } }
      ]
    });

    // res.status(200).json({ updatedCaseData });
    res.status(200).json({ updatedCase: updatedCaseData });
  } catch (err) {
    next(err);
  }
};

exports.deleteCaseByPatientId = async (req, res, next) => {
  let t;

  try {
    t = await sequelize.transaction();

    const { patientId, caseId } = req.params;

    const caseIdNumber = parseInt(caseId, 10);
    const patientIdNumber = parseInt(patientId, 10);

    const caseData = await Case.findOne({ where: { id: caseIdNumber } });
    if (!caseData) {
      throw new AppError('case was not found', 400);
    }
    if (patientIdNumber !== caseData.patientId) {
      console.log('patientId:', patientId);
      console.log('CaseData.patientId:', caseData.patientId);
      console.log('caseId:', caseData.id);
      throw new AppError('no permission to delete', 403);
    }

    await Receipt.destroy({
      where: { caseId: caseData.id },
      transaction: t
    });
    await Appointment.destroy({
      where: { caseId: caseData.id },
      transaction: t
    });
    await Payment.destroy({ where: { caseId: caseData.id }, transaction: t });
    await Treatment.destroy({ where: { caseId: caseData.id }, transaction: t });
    await Case.destroy({ where: { id: caseData.id }, transaction: t });

    await t.commit();

    res.status(200).json({ message: 'success delete' });
  } catch (err) {
    // if (t && t.finished !== 'commit') {
    await t.rollback();
    // }
    next(err);
  }
};

exports.getAllCases = async (req, res, next) => {
  try {
    const casesData = await Case.findAll({
      attributes: { exclude: ['staffId', 'patientId'] },
      include: [
        { model: Staff, attributes: { exclude: 'password' } },
        { model: Patient, attributes: { exclude: 'password' } }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ casesData });
  } catch (err) {
    next(err);
  }
};

exports.getCasesWithoutTreatment = async (req, res, next) => {
  try {
    //find all caseId in treatments
    //map treatments to caseIds array
    //find cases without treatments
    const treatments = await Treatment.findAll({
      attributes: ['caseId']
    });

    const caseIds = treatments.map((item) => item.caseId);

    const casesWithoutTreatment = await Case.findAll({
      where: {
        id: {
          [Op.notIn]: caseIds
        }
      },
      attributes: { exclude: ['staffId', 'patientId'] },
      include: [
        { model: Staff, attributes: { exclude: 'password' } },
        { model: Patient, attributes: { exclude: 'password' } }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ casesData: casesWithoutTreatment });
  } catch (err) {
    next(err);
  }
};

exports.getCaseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const caseId = parseInt(id, 10);

    const caseData = await Case.findOne({
      where: { id: caseId },
      attributes: { exclude: ['staffId', 'patientId'] },
      include: [
        { model: Staff, attributes: { exclude: ['password'] } },
        { model: Patient, attributes: { exclude: ['password'] } }
      ],
      order: [['createdAt', 'DESC']]
    });

    if (!caseData) {
      throw new AppError('Case with the specified ID not found', 400);
    }

    res.status(200).json({ caseData });
  } catch (err) {
    next(err);
  }
};

exports.getSearchCases = async (req, res, next) => {
  try {
    const { searchTerm } = req.query;
    // console.log('SearchTerm:', searchTerm);

    let casesData;

    if (!searchTerm) {
      casesData = await Case.findAll({
        attributes: { exclude: ['staffId', 'patientId'] },
        include: [
          { model: Staff, attributes: { exclude: 'password' } },
          { model: Patient, attributes: { exclude: 'password' } }
        ],
        order: [['createdAt', 'DESC']]
      });
    } else {
      const patients = await Patient.findAll({
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
        }
      });

      if (patients.length === 0) {
        // throw new AppError('No matching patient found', 400);
        return res
          .status(200)
          .json({ message: 'No matching patient found', casesData: [] });
      }

      const patientIds = patients.map((patient) => patient.id);

      casesData = await Case.findAll({
        where: {
          patientId: {
            [Op.in]: patientIds
          }
        },
        attributes: { exclude: ['staffId', 'patientId'] },
        include: [
          { model: Staff, attributes: { exclude: 'password' } },
          { model: Patient, attributes: { exclude: 'password' } }
        ],
        order: [['createdAt', 'DESC']]
      });
    }

    if (casesData.length === 0) {
      return res
        .status(200)
        .json({ message: 'No matching cases found.', casesData: [] });
    }

    res.status(200).json({ casesData });
  } catch (err) {
    console.error('Error:', err);
    next(err);
  }
};

exports.getCasesWithReceipt = async (req, res, next) => {
  try {
    const casesWithReceipt = await Case.findAll({
      attributes: { exclude: ['staffId'] },
      include: [
        { model: Patient, attributes: { exclude: 'password' } },
        {
          model: Receipt,
          required: true,
          // as: 'Receipt'
          where: { id: { [Op.not]: null } }
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ casesData: casesWithReceipt });
  } catch (err) {
    next(err);
  }
};
