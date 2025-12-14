const router = require('express').Router();
const ctrl = require('./auth.controller');

router.post('/send-otp', ctrl.sendOtp);
router.post('/verify-otp', ctrl.verifyOtp);

module.exports = router;
