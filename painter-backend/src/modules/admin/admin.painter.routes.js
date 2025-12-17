const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const role = require('../../middlewares/role.middleware');
const ctrl = require('./admin.painter.controller');

router.get('/painters', auth, role(['ADMIN']), ctrl.getAllPainters);
router.post('/painters/:id/approve-kyc', auth, role(['ADMIN']), ctrl.approveKyc);
router.post('/painters/:id/reject-kyc', auth, role(['ADMIN']), ctrl.rejectKyc);
router.post('/painters/:id/block', auth, role(['ADMIN']), ctrl.blockPainter);
router.post('/painters/:id/unblock', auth, role(['ADMIN']), ctrl.unblockPainter);

module.exports = router;