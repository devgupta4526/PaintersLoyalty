const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const upload = require('../../utils/upload');
const ctrl = require('./painter.controller');

router.get('/profile', auth, ctrl.getProfile);
router.get('/portfolio', auth, ctrl.getPortfolio);
router.post('/profile', auth, ctrl.createOrUpdateProfile);
router.post('/photo', auth, upload.single('photo'), ctrl.uploadPhoto);
router.post('/kyc', auth, upload.single('idProof'), ctrl.uploadKyc);
router.post('/skills', auth, ctrl.addSkills);
router.post('/bank-details', auth, ctrl.updateBankDetails);

module.exports = router;
