const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const ctrl = require('./offer.controller');

router.get('/', auth, ctrl.getOffers);
router.post('/:id/join', auth, ctrl.join);

module.exports = router;
