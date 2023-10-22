const express = require('express');

const patientController = require('../controllers/patientController');
const caseController = require('../controllers/caseController');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/', patientController.getAllPatients);

router.get('/search', patientController.getSearchPatients);

router.get('/:id', patientController.getPatientById);

router.patch(
  '/:patientId',
  // upload.fields([{ name: 'profileImage', maxCount: 1 }]),
  upload.single('profileImage'),
  patientController.updatePatient
);

router.get('/:id/cases', caseController.getCasesByPatientId);

router.route('/:id/case').post(caseController.createCase);

router
  .route('/:patientId/cases/:caseId')
  .patch(caseController.updateCaseByPatientId)
  .delete(caseController.deleteCaseByPatientId);

module.exports = router;
