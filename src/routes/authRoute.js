const express = require('express');

const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.post('/staff/register', authController.staffRegister);
router.post('/staff/login', authController.staffLogin);
router.get('/staff/me', authenticate.authorizeStaff, authController.getStaffMe);

router.post('/patient/register', authController.patientRegister);
router.post('/patient/login', authController.patientLogin);
router.get('/patient/me', authenticate.authorizePatient, authController.getMe);

module.exports = router;
