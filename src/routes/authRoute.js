const express = require('express');

const authController = require('../controllers/authController');

const router = express.Router();

router.post('/staff/register', authController.staffRegister);
router.post('/staff/login', authController.staffLogin);
router.post('/register', authController.patientRegister);
router.post('/login', authController.patientLogin);

module.exports = router;
