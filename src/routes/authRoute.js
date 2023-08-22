const express = require('express');

const authController = require('../controllers/authController');

const router = express.Router();

router.post('/staff/register', authController.staffRegister);
router.post('/patient/register', authController.patientRegister);

module.exports = router;
