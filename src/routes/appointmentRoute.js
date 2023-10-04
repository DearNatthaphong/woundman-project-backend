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

module.exports = router;
