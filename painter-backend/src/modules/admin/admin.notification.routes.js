const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const role = require('../../middlewares/role.middleware');
const ctrl = require('./admin.notification.controller');

router.post(
  '/notifications/all',
  auth,
  role(['ADMIN']),
  ctrl.sendAll
);

router.post(
  '/notifications/user/:userId',
  auth,
  role(['ADMIN']),
  ctrl.sendUser
);

router.post(
  '/notifications/region/:region',
  auth,
  role(['ADMIN']),
  ctrl.sendRegion
);

module.exports = router;
