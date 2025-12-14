const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const ctrl = require('./training.controller');

router.get('/', auth, ctrl.getAll);
router.post('/:id/complete', auth, ctrl.complete);

module.exports = router;
