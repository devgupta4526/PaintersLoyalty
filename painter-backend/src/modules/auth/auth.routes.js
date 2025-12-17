const router = require('express').Router();
const ctrl = require('./auth.controller');

router.post('/send-otp', ctrl.sendOtp);
router.post('/verify-otp', ctrl.verifyOtp);
router.post('/login', ctrl.login); // Added for admin login
router.post('/register-admin', ctrl.registerAdmin); // Added for admin registration

module.exports = router;
