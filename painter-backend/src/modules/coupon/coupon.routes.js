const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const ctrl = require('./coupon.controller');

router.post('/redeem', auth, ctrl.redeemCoupon);

module.exports = router;
