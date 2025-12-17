const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const ctrl = require('./product.controller');

router.get('/', auth, ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.get('/category/:category', auth, ctrl.getByCategory);
router.get('/search', auth, ctrl.search);
router.get('/filter', auth, ctrl.filter);

module.exports = router;