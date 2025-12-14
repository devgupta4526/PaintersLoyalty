const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const ctrl = require('./painter.controller');

router.get('/profile', auth, ctrl.getProfile);
router.post('/profile', auth, ctrl.createOrUpdateProfile);
router.post('/bank-details', auth, ctrl.updateBankDetails);

module.exports = router;
