const express = require('express');
const caseController = require('../controllers/caseController');
const treatmentController = require('../controllers/treatmentController');
const upload = require('../middlewares/upload');

const router = express.Router();

router.route('/').get(caseController.getAllCases);

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
  .patch(upload.single('image'), treatmentController.updateTreatmentByCaseId);

module.exports = router;
