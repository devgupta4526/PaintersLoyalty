const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const role = require('../../middlewares/role.middleware');
const ctrl = require('./admin.training.controller');

router.post('/trainings', auth, role(['ADMIN']), ctrl.create);
router.get('/trainings', auth, role(['ADMIN']), ctrl.list);
router.post('/trainings/:id/status', auth, role(['ADMIN']), ctrl.toggle);

module.exports = router;
