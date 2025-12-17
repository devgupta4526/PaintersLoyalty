const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const role = require('../../middlewares/role.middleware');
const ctrl = require('./dealer.controller');

router.get('/painters', auth, role(['DEALER']), ctrl.getMyPainters);
router.post('/painters/:id/approve', auth, role(['DEALER']), ctrl.approvePainter);
router.get('/complaints', auth, role(['DEALER']), ctrl.getComplaints);
router.get('/dashboard', auth, role(['DEALER']), ctrl.getDashboard);
router.post('/offers/:id/approve', auth, role(['DEALER']), ctrl.approveOffer);
router.post('/offers/:id/reject', auth, role(['DEALER']), ctrl.rejectOffer);
router.get('/offers/pending', auth, role(['DEALER']), ctrl.getPendingOffers);
router.post('/coupons/assign', auth, role(['DEALER']), ctrl.assignCoupons);

module.exports = router;