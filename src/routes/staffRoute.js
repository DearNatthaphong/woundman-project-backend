const express = require('express');

const upload = require('../middlewares/upload');
const staffController = require('../controllers/staffController');

const router = express.Router();

router.patch(
  '/',
  // upload.single('profileImage'),
  upload.fields([{ name: 'profileImage', maxCount: 1 }]),
  staffController.updateStaff
);

module.exports = router;
