const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const ctrl = require('./notification.controller');

router.get('/', auth, ctrl.myNotifications);
router.post('/:id/read', auth, ctrl.read);

module.exports = router;

