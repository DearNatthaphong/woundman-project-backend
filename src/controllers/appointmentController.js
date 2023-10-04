const { Appointment } = require('../models');
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
