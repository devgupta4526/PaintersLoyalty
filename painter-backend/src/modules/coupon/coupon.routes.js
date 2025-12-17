const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const ctrl = require('./coupon.controller');

router.post('/validate', auth, ctrl.validate);
router.post('/redeem', auth, ctrl.redeemCoupon);
router.get('/my', auth, ctrl.getMyCoupons);

module.exports = router;
