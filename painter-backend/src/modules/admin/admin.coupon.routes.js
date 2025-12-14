const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const role = require('../../middlewares/role.middleware');
const ctrl = require('./admin.coupon.controller');

router.post('/coupons/generate', auth, role(['ADMIN']), ctrl.generate);

module.exports = router;
