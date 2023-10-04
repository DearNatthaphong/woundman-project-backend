const { Appointment, Case } = require('../models');
const AppError = require('../utils/appError');
const validator = require('validator');

exports.createAppointment = async (req, res, next) => {
  try {
    const { reason, appointmentDate, status } = req.body;

    // const isEmptyReason = validator.isEmpty(reason + '', {
    //   ignore_whitespace: false
    // });
    // const isEmptyAppointmentDate = validator.isEmpty(appointmentDate + '', {
    //   ignore_whitespace: false
    // });
    // const isEmptyStatus = validator.isEmpty(status + '', {
    //   ignore_whitespace: false
    // });

    // if (
    //   !reason ||
    //   isEmptyReason ||
    //   !appointmentDate ||
    //   isEmptyAppointmentDate ||
    //   !status ||
    //   isEmptyStatus
    // ) {
    //   throw new AppError('ข้อมูลไม่ครบ', 400);
    // }

    if (!reason || !reason.trim() || !appointmentDate || !status) {
      throw new AppError('ข้อมูลไม่ครบ', 400);
    }

    const { id } = req.params;
    const staffId = req.user.id;
    const caseId = parseInt(id, 10);
    const data = { caseId };

    if (reason && reason.trim()) {
      data.reason = reason;
    }
    const isDate = validator.isDate(appointmentDate, new Date());

    if (isDate) {
      data.appointmentDate = appointmentDate;
    }
    if (status) {
      data.status = status;
    }

    const newAppointment = await Appointment.create({ ...data, staffId });
    const newAppointmentData = await Appointment.findOne({
      where: { id: newAppointment.id }
    });

    res.status(200).json({ newAppointment: newAppointmentData });
  } catch (err) {
    next(err);
  }
};

exports.getAppointmentByCaseId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const caseData = await Case.findOne({ where: { id } });
    if (!caseData) {
      throw new AppError('Data not found', 400);
    }

    const appointment = await Appointment.findOne({
      where: { caseId: id },
      //   attributes: {exclude: ['caseId','staffId']},
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ appointment });
  } catch (err) {
    next(err);
  }
};
