const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const ctrl = require('./dashboard.controller');

router.get('/', auth, ctrl.getDashboard);

module.exports = router;
