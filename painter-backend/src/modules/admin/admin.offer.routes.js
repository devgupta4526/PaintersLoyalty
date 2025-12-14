const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const role = require('../../middlewares/role.middleware');
const ctrl = require('./admin.offer.controller');

router.post('/offers', auth, role(['ADMIN']), ctrl.create);
router.get('/offers', auth, role(['ADMIN']), ctrl.list);
router.post('/offers/:id/status', auth, role(['ADMIN']), ctrl.status);

module.exports = router;
