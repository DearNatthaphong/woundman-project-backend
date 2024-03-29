const { Op } = require('sequelize');
const { Appointment, Case, Patient, Staff } = require('../models');
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
      where: { id: newAppointment.id },
      attributes: { exclude: ['staffId'] },
      include: [{ model: Staff, attributes: { exclude: 'password' } }]
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

    const appointments = await Appointment.findAll({
      where: { caseId: id },
      attributes: { exclude: ['staffId'] },
      include: [{ model: Staff, attributes: { exclude: 'password' } }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ appointments });
  } catch (err) {
    next(err);
  }
};

exports.updateAppointmentByCaseId = async (req, res, next) => {
  try {
    const { caseId, appointmentId } = req.params;
    const { reason, appointmentDate, status } = req.body;

    if (!reason || !reason.trim() || !appointmentDate || !status) {
      throw new AppError('ข้อมูลไม่ครบ', 400);
    }

    const updatedData = {};

    if (reason && reason.trim()) {
      updatedData.reason = reason;
    }
    const isDate = validator.isDate(appointmentDate, new Date());

    if (isDate) {
      updatedData.appointmentDate = appointmentDate;
    }
    if (status) {
      updatedData.status = status;
    }

    const updatedAppointment = await Appointment.update(updatedData, {
      where: { caseId, id: appointmentId }
    });

    if (!updatedAppointment) {
      throw new AppError('Appointment not found or could not be updated', 400);
    }

    const updatedAppointmentData = await Appointment.findOne({
      where: { id: appointmentId },
      attributes: { exclude: ['staffId'] },
      include: [{ model: Staff, attributes: { exclude: 'password' } }]
    });

    res.status(200).json({ updatedAppointment: updatedAppointmentData });
  } catch (err) {
    next(err);
  }
};

exports.deleteAppointmentByCaseId = async (req, res, next) => {
  try {
    const { caseId, appointmentId } = req.params;

    const appointmentData = await Appointment.findOne({
      where: { id: appointmentId }
    });
    if (!appointmentData) {
      throw new AppError('appointment was not found', 400);
    }
    if (+caseId !== appointmentData.caseId) {
      console.log('caseId:', caseId);
      console.log('appointmentData.caseId:', appointmentData.caseId);
      throw new AppError('no permission to delete', 403);
    }

    await Appointment.destroy({ where: { id: appointmentData.id } });

    res.status(200).json({ message: 'success delete' });
  } catch (err) {
    next(err);
  }
};

exports.getAppointments = async (req, res, next) => {
  try {
    const appointmentsData = await Appointment.findAll({
      attributes: { exclude: ['staffId'] },
      include: [
        { model: Staff, attributes: { exclude: 'password' } },
        {
          model: Case,
          attributes: ['chiefComplain'],
          include: [{ model: Patient, attributes: { exclude: 'password' } }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ appointments: appointmentsData });
  } catch (err) {
    next(err);
  }
};

exports.getAppointmentsByFilter = async (req, res, next) => {
  try {
    const { status } = req.query;

    let appointmentsData;

    if (!status) {
      appointmentsData = await Appointment.findAll({
        attributes: { exclude: ['staffId'] },
        include: [
          { model: Staff, attributes: { exclude: 'password' } },
          {
            model: Case,
            attributes: ['chiefComplain'],
            include: [{ model: Patient, attributes: { exclude: ['password'] } }]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    } else {
      appointmentsData = await Appointment.findAll({
        where: { status },
        attributes: { exclude: ['staffId'] },
        include: [
          { model: Staff, attributes: { exclude: 'password' } },
          {
            model: Case,
            attributes: ['chiefComplain'],
            include: [{ model: Patient, attributes: { exclude: 'password' } }]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    }

    if (appointmentsData.length === 0) {
      return (
        res
          .status(200)
          // .json({ message: 'No matching appointments found.' });
          .json({
            message: 'No matching appointments found.',
            appointments: []
          })
      );
    }

    res.status(200).json({ appointments: appointmentsData });
  } catch (err) {
    next(err);
  }
};

// exports.getAppointmentsBySearch = async (req, res, next) => {
//   try {
//     const { searchTerm } = req.query;

//     const appointmentsData = await Appointment.findAll({
//       where: {
//         [Op.or]: [
//           {
//             '$Case.Patient.first_name$': {
//               [Op.like]: `%${searchTerm}%`
//             }
//           },
//           {
//             '$Case.Patient.last_name$': {
//               [Op.like]: `%${searchTerm}%`
//             }
//           }
//         ]
//       },
//       attibutes: { exclude: ['caseId'] },
//       include: [
//         {
//           model: Case,
//           attributes: ['chiefComplain'],
//           include: [
//             {
//               model: Patient,
//               attributes: { exclude: ['password'] },
//               as: 'Patient'
//             }
//           ]
//         }
//       ],
//       order: [['createdAt', 'DESC']]
//     });

//     if (appointmentsData.length === 0) {
//       return res
//         .status(404)
//         .json({ message: 'No matching appointments found.' });
//     }

//     res.status(200).json({ appointments: appointmentsData });
//   } catch (err) {
//     next(err);
//   }
// };

exports.getAppointmentsBySearch = async (req, res, next) => {
  try {
    const { searchTerm } = req.query;

    let appointmentsData;

    if (!searchTerm) {
      appointmentsData = await Appointment.findAll({
        attributes: { exclude: ['staffId'] },
        include: [
          { model: Staff, attributes: { exclude: 'password' } },
          {
            model: Case,
            attributes: ['chiefComplain'],
            include: [{ model: Patient, attributes: { exclude: ['password'] } }]
          }
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
          .json({ message: 'No matching patient found', appointments: [] });
      }

      const patientIds = patients.map((patient) => patient.id);

      const cases = await Case.findAll({
        where: {
          patientId: {
            [Op.in]: patientIds
          }
        }
      });

      if (cases.length === 0) {
        throw new AppError('No matching cases found', 400);
      }

      const caseIds = cases.map((item) => item.id);

      appointmentsData = await Appointment.findAll({
        where: {
          caseId: {
            [Op.in]: caseIds
          }
        },
        // attributes: { exclude: ['caseId'] },
        attributes: { exclude: ['staffId'] },
        include: [
          { model: Staff, attributes: { exclude: 'password' } },
          {
            model: Case,
            attributes: ['chiefComplain'],
            include: [{ model: Patient, attributes: { exclude: ['password'] } }]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    }

    res.status(200).json({ appointments: appointmentsData });
  } catch (err) {
    next(err);
  }
};

exports.updateAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason, appointmentDate, status } = req.body;

    if (!reason || !reason.trim() || !appointmentDate || !status) {
      throw new AppError('ข้อมูลไม่ครบ', 400);
    }

    const updatedData = {};

    if (reason && reason.trim()) {
      updatedData.reason = reason;
    }
    const isDate = validator.isDate(appointmentDate, new Date());

    if (isDate) {
      updatedData.appointmentDate = appointmentDate;
    }
    if (status) {
      updatedData.status = status;
    }

    const updatedAppointment = await Appointment.update(updatedData, {
      where: { id }
    });

    if (!updatedAppointment) {
      throw new AppError('Appointment not found or could not be updated', 400);
    }

    const updatedAppointmentData = await Appointment.findOne({
      where: { id }
    });

    res.status(200).json({ updatedAppointment: updatedAppointmentData });
  } catch (err) {
    next(err);
  }
};

exports.getAppointmentsByPatientId = async (req, res, next) => {
  try {
    const patientId = req.user.id;

    const appointmentsData = await Appointment.findAll({
      attributes: { exclude: ['staffId', 'caseId'] },
      include: [
        { model: Staff, attributes: { exclude: 'password' } },
        {
          model: Case,
          where: { patientId },
          attributes: ['chiefComplain'],
          include: [
            {
              model: Patient,
              attributes: { exclude: 'password' }
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ appointments: appointmentsData });
  } catch (err) {
    next(err);
  }
};
