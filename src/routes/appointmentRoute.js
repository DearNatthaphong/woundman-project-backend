const express = require('express');

const authenticate = require('../middlewares/authenticate');
const appointmentController = require('../controllers/appointmentController');

const router = express.Router();

router
  .route('/patients')
  .get(authenticate.authorizeStaff, appointmentController.getAppointments);

router
  .route('/patients/filter')
  .get(
    authenticate.authorizeStaff,
    appointmentController.getAppointmentsByFilter
  );

router
  .route('/patients/search')
  .get(
    authenticate.authorizeStaff,
    appointmentController.getAppointmentsBySearch
  );

router
  .route('/:id')
  .patch(
    authenticate.authorizeStaff,
    appointmentController.updateAppointmentById
  );

router
  .route('/patient')
  .get(
    authenticate.authorizePatient,
    appointmentController.getAppointmentsByPatientId
  );

module.exports = router;
