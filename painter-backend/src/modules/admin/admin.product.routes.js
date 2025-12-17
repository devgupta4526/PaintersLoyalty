const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const role = require('../../middlewares/role.middleware');
const ctrl = require('./admin.product.controller');

router.post('/products', auth, role(['ADMIN']), ctrl.create);
router.get('/products', auth, role(['ADMIN']), ctrl.list);
router.put('/products/:id', auth, role(['ADMIN']), ctrl.update);
router.delete('/products/:id', auth, role(['ADMIN']), ctrl.delete);

module.exports = router;