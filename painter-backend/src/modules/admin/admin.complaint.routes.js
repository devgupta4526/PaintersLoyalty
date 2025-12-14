const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const role = require('../../middlewares/role.middleware');
const ctrl = require('./admin.complaint.controller');

router.get('/complaints', auth, role(['ADMIN']), ctrl.getAll);
router.post('/complaints/:id', auth, role(['ADMIN']), ctrl.update);

module.exports = router;
