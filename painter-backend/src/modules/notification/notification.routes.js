const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const ctrl = require('./notification.controller');

router.get('/', auth, ctrl.myNotifications);
router.get('/:id', auth, ctrl.getById);
router.post('/register-device', auth, ctrl.registerDevice);
router.post('/:id/read', auth, ctrl.read);

module.exports = router;

