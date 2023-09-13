const express = require('express');

const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload');
const staffController = require('../controllers/staffController');

const router = express.Router();

router.patch(
  '/',
  authenticate.authorizeStaff,
  // upload.single('profileImage'),
  upload.fields([{ name: 'profileImage', maxCount: 1 }]),
  staffController.updateStaff
);

module.exports = router;
