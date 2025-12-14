const router = require('express').Router();

router.use('/auth', require('./modules/auth/auth.routes'));


router.use('/auth', require('./modules/auth/auth.routes'));
router.use('/painter', require('./modules/painter/painter.routes'));


router.use('/coupon', require('./modules/coupon/coupon.routes'));

router.use('/wallet', require('./modules/wallet/wallet.routes'));

router.use('/withdrawals', require('./modules/withdrawal/withdrawal.routes'));


router.use('/admin', require('./modules/admin/admin.withdrawal.routes'));
router.use('/admin', require('./modules/admin/admin.complaint.routes'));
router.use('/admin', require('./modules/admin/admin.coupon.routes'));


router.use('/dashboard', require('./modules/dashboard/dashboard.routes'));

router.use('/complaints', require('./modules/complaint/complaint.routes'));

router.use('/offers', require('./modules/offer/offer.routes'));

router.use('/admin', require('./modules/admin/admin.offer.routes'));

router.use('/trainings', require('./modules/training/training.routes'));

router.use('/admin', require('./modules/admin/admin.training.routes'));


module.exports = router;
