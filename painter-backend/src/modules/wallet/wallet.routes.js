const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const ctrl = require('./wallet.controller');

router.get('/summary', auth, ctrl.getSummary);
router.get('/monthly', auth, ctrl.getMonthly);
router.get('/quarterly', auth, ctrl.getQuarterly);

module.exports = router;
