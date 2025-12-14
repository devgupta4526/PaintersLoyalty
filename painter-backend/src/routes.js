const router = require('express').Router();

router.use('/auth', require('./modules/auth/auth.routes'));


router.use('/auth', require('./modules/auth/auth.routes'));
router.use('/painter', require('./modules/painter/painter.routes'));


router.use('/coupon', require('./modules/coupon/coupon.routes'));

router.use('/wallet', require('./modules/wallet/wallet.routes'));

router.use('/withdrawals', require('./modules/withdrawal/withdrawal.routes'));




module.exports = router;
