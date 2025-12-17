const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const ctrl = require('./training.controller');

router.get('/categories', auth, ctrl.getCategories);
router.get('/', auth, ctrl.getAll);
router.get('/my', auth, ctrl.getMy);
router.get('/:id/progress', auth, ctrl.getProgress);
router.post('/:id/complete', auth, ctrl.complete);

module.exports = router;
