const express = require('express');

const upload = require('../middlewares/upload');
const staffController = require('../controllers/staffController');

const router = express.Router();

router.patch(
  '/',
  // upload.fields([{ name: 'profileImage', maxCount: 1 }]),
  upload.single('profileImage'),
  staffController.updateStaff
);

module.exports = router;
