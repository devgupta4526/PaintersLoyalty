const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const role = require('../../middlewares/role.middleware');
const ctrl = require('./admin.coupon.controller');

router.post('/coupons/generate', auth, role(['ADMIN']), ctrl.generate);
router.get('/coupons', auth, role(['ADMIN']), ctrl.list);
router.post('/coupons/assign', auth, role(['ADMIN']), ctrl.assign);
router.get('/coupons/stats', auth, role(['ADMIN']), ctrl.stats);

module.exports = router;
