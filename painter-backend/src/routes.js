const router = require('express').Router();

router.use('/auth', require('./modules/auth/auth.routes'));


router.use('/auth', require('./modules/auth/auth.routes'));
router.use('/painter', require('./modules/painter/painter.routes'));


module.exports = router;
