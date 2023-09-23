const express = require('express');

const patientController = require('../controllers/patientController');
const caseController = require('../controllers/caseController');
const upload = require('../middlewares/upload');

const router = express.Router();

router.patch(
  '/:patientId',
  upload.fields([{ name: 'profileImage', maxCount: 1 }]),
  patientController.updatePatient
);

router.get('/', patientController.getAllPatients);

router.get('/search', patientController.getSearchPatients);

router.get('/:id', patientController.getPatientById);

router.get('/:id/cases', caseController.getCasesByPatientId);

router.route('/:id/case').post(caseController.createCase);

module.exports = router;
