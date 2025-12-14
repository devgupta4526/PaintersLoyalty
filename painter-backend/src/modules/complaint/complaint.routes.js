const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const upload = require('../../utils/upload');
const ctrl = require('./complaint.controller');

router.post(
  '/',
  auth,
  upload.array('images', 3),
  ctrl.create
);

router.get('/my', auth, ctrl.myComplaints);

module.exports = router;
