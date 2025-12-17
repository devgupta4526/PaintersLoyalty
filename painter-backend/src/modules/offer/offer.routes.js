const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const ctrl = require('./offer.controller');

router.get('/', auth, ctrl.getOffers);
router.get('/in-progress', auth, ctrl.getInProgress);
router.get('/redeemed', auth, ctrl.getRedeemed);
router.get('/closed', auth, ctrl.getClosed);
router.post('/:id/join', auth, ctrl.join);
router.get('/:id/progress', auth, ctrl.getProgress);
router.post('/:id/complete', auth, ctrl.complete);

module.exports = router;
