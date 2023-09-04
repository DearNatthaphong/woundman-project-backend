const express = require('express');

const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.post('/staff/register', authController.staffRegister);
router.post('/staff/login', authController.staffLogin);
router.get('/staff/me', authenticate.authorizeStaff, authController.getStaffMe);

router.post('/register', authController.patientRegister);
router.post('/login', authController.patientLogin);
router.get('/me', authenticate.authorizePatient, authController.getMe);

module.exports = router;
