const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const role = require('../../middlewares/role.middleware');
const ctrl = require('./admin.withdrawal.controller');

router.get('/withdrawals', auth, role(['ADMIN']), ctrl.getWithdrawals);
router.post('/withdrawals/:id/approve', auth, role(['ADMIN']), ctrl.approve);
router.post('/withdrawals/:id/reject', auth, role(['ADMIN']), ctrl.reject);

module.exports = router;
