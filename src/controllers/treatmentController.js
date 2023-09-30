const fs = require('fs');
const AppError = require('../utils/appError');
const { Case, Staff, Treatment, sequelize } = require('../models');
const cloudinary = require('../utils/cloudinary');

exports.createTreatment = async (req, res, next) => {
  try {
    const { position, diagnosis, treatment } = req.body;

    if (
      !position ||
      !position.trim() ||
      !diagnosis ||
      !diagnosis.trim() ||
      !treatment ||
      !treatment.trim()
    ) {
      throw new AppError('ข้อมูลไม่ครบ', 400);
    }

    const { id } = req.params;
    const staffId = req.user.id;
    const caseId = parseInt(id, 10);
    const data = { caseId };

    if (position && position.trim()) {
      data.position = position;
    }
    if (diagnosis && diagnosis.trim()) {
      data.diagnosis = diagnosis;
    }
    if (treatment && treatment.trim()) {
      data.treatment = treatment;
    }
    if (req.file) {
      const imagePath = req.file.path;
      const image = req.body.image;
      const secureUrl = await cloudinary.upload(
        imagePath,
        image ? cloudinary.getPublicId(image) : undefined
      );

      data.image = secureUrl;
      fs.unlinkSync(imagePath);
    }

    const newTreatment = await Treatment.create({ ...data, staffId });
    const newTreatmentData = await Treatment.findOne({
      where: { id: newTreatment.id }
      //   attributes: { exclude: ['staffId', 'caseId'] },
      //   include: [
      //     { model: Staff, attributes: { exclude: 'password' } },
      //     { model: Case }
      //   ]
    });

    res.status(200).json({ newTreatment: newTreatmentData });
  } catch (err) {
    next(err);
  }
};

exports.getTreatmentsByCaseId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const caseData = await Case.findOne({ where: { id } });
    if (!caseData) {
      throw new AppError('Data not found', 400);
    }

    const treatments = await Treatment.findAll({
      where: { caseId: id },
      attributes: { exclude: ['caseId'] },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ treatments });
  } catch (err) {
    next(err);
  }
};

exports.updateTreatmentByCaseId = async (req, res, next) => {
  try {
    const { caseId, treatmentId } = req.params;
    const { position, diagnosis, treatment } = req.body;

    if (
      !position ||
      !position.trim() ||
      !diagnosis ||
      !diagnosis.trim() ||
      !treatment ||
      !treatment.trim()
    ) {
      throw new AppError('ข้อมูลไม่ครบ', 400);
    }

    const updatedData = {};

    if (position && position.trim()) {
      updatedData.position = position;
    }
    if (diagnosis && diagnosis.trim()) {
      updatedData.diagnosis = diagnosis;
    }
    if (treatment && treatment.trim()) {
      updatedData.treatment = treatment;
    }
    if (req.file) {
      const imagePath = req.file.path;
      const image = req.body.image;
      const secureUrl = await cloudinary.upload(
        imagePath,
        image ? cloudinary.getPublicId(image) : undefined
      );

      updatedData.image = secureUrl;
      fs.unlinkSync(imagePath);
    }

    const updatedTreatment = await Treatment.update(updatedData, {
      where: { caseId, id: treatmentId }
    });

    if (!updatedTreatment) {
      throw new AppError('Treatment not found or could not be updated', 400);
    }

    const updatedTreatmentData = await Treatment.findOne({
      where: { id: treatmentId }
    });

    res.status(200).json({ updatedTreatment: updatedTreatmentData });
  } catch (err) {
    next(err);
  }
};

exports.deleteTreatmentByCaseId = async (req, res, next) => {
  try {
    const { caseId, treatmentId } = req.params;

    const treatmentData = await Treatment.findOne({
      where: { id: treatmentId }
    });
    if (!treatmentData) {
      throw new AppError('treatment was not found', 400);
    }
    if (+caseId !== treatmentData.caseId) {
      console.log('caseId:', caseId);
      console.log('treatmentData.caseId:', treatmentData.caseId);
      throw new AppError('no permission to delete', 403);
    }

    await Treatment.destroy({ where: { id: treatmentData.id } });

    res.status(200).json({ message: 'success delete' });
  } catch (err) {
    next(err);
  }
};

exports.getAlltreatmentByPatientId = async (req, res, next) => {
  try {
    const id = req.user.id;
    const casesData = await Case.findAll({
      where: { patientId: id },
      order: [['createdAt', 'DESC']]
    });

    //casesData = [caseData1,caseData2,caseData3]

    const allTreatments = [];

    for (const caseItem of casesData) {
      const caseTreatments = await Treatment.findAll({
        where: { caseId: caseItem.id },
        order: [['createdAt', 'DESC']]
      });

      allTreatments.push(...caseTreatments);
    }

    res.status(200).json({ allTreatments });
  } catch (err) {
    next(err);
  }
};

exports.getTreatmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const treatment = await Treatment.findOne({ where: { id } });
    if (!treatment) {
      throw new AppError('Data not found', 400);
    }

    res.status(200).json({ treatment });
  } catch (err) {
    next(err);
  }
};
