const express = require('express');
const caseController = require('../controllers/caseController');
const treatmentController = require('../controllers/treatmentController');
const appointmentController = require('../controllers/appointmentController');
const upload = require('../middlewares/upload');

const router = express.Router();

router.route('/').get(caseController.getAllCases);

router.route('/without-treatment').get(caseController.getCasesWithoutTreatment);

router.get('/search', caseController.getSearchCases);
// router.route('/search').get(caseController.getSearchCases);

router.route('/:id').get(caseController.getCaseById);

router.route('/:id').patch(caseController.updateCaseByCaseId);

router
  .route('/:id/treatments')
  .post(upload.single('image'), treatmentController.createTreatment);

router.route('/:id/treatments').get(treatmentController.getTreatmentsByCaseId);

router
  .route('/:caseId/treatments/:treatmentId')
  .patch(upload.single('image'), treatmentController.updateTreatmentByCaseId)
  .delete(treatmentController.deleteTreatmentByCaseId);

module.exports = router;

router.route('/:id/appointment').post(appointmentController.createAppointment);

router
  .route('/:id/appointment')
  .get(appointmentController.getAppointmentByCaseId);

router
  .route('/:caseId/appointment/:appointmentId')
  .patch(appointmentController.updateAppointmentByCaseId)
  .delete(appointmentController.deleteAppointmentByCaseId);
