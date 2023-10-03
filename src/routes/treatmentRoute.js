const express = require('express');
const treatmentController = require('../controllers/treatmentController');

const router = express.Router();

router.get('/', treatmentController.getAllTreatmentByPatientId);

router.get('/:id', treatmentController.getTreatmentById);

module.exports = router;
