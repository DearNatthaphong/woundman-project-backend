const express = require('express');

const authenticate = require('../middlewares/authenticate');

const patientController = require('../controllers/patientController');
const upload = require('../middlewares/upload');

const router = express.Router();

router.patch(
  '/:patientId',
  authenticate.authorizeStaff,
  upload.fields([{ name: 'profileImage', maxCount: 1 }]),
  patientController.updatePatient
);

module.exports = router;
