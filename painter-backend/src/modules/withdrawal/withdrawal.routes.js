const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const ctrl = require('./withdrawal.controller');

router.post('/request', auth, ctrl.requestWithdrawal);
router.get('/my', auth, ctrl.getMyWithdrawals);

module.exports = router;
