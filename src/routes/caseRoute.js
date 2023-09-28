const express = require('express');
const caseController = require('../controllers/caseController');

const router = express.Router();

router.route('/').get(caseController.getAllCases);

router.get('/search', caseController.getSearchCases);
// router.route('/search').get(caseController.getSearchCases);

router.route('/:id').get(caseController.getCaseById);

router.route('/:id').patch(caseController.updateCaseByCaseId);

module.exports = router;
