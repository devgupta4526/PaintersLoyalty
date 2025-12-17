const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const upload = require('../../utils/upload');
const ctrl = require('./complaint.controller');

router.get('/categories', auth, ctrl.getCategories);

router.post(
  '/',
  auth,
  upload.array('images', 3),
  ctrl.create
);

router.get('/my', auth, ctrl.myComplaints);
router.get('/:id/history', auth, ctrl.getHistory);

module.exports = router;
