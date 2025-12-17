const Offer = require('../offer/offer.model');
const PainterProfile = require('../painter/painter.model');
const Complaint = require('../complaint/complaint.model');

exports.getMyPainters = async (req, res, next) => {
  try {
    const painters = await PainterProfile.find({ dealerId: req.user.userId }).populate('userId', 'mobile email');
    res.json(painters);
  } catch (e) {
    next(e);
  }
};

exports.approvePainter = async (req, res, next) => {
  try {
    const painter = await PainterProfile.findByIdAndUpdate(req.params.id, { dealerApproved: true }, { new: true });
    res.json(painter);
  } catch (e) {
    next(e);
  }
};

exports.getComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ assignedTo: req.user.userId }).populate('userId', 'fullName mobile');
    res.json(complaints);
  } catch (e) {
    next(e);
  }
};

exports.getDashboard = async (req, res, next) => {
  try {
    const paintersCount = await PainterProfile.countDocuments({ dealerId: req.user.userId });
    const offersPending = await Offer.countDocuments({ status: 'PENDING_DEALER' });
    const complaintsCount = await Complaint.countDocuments({ assignedTo: req.user.userId, status: 'OPEN' });
    res.json({
      paintersCount,
      offersPending,
      complaintsCount
    });
  } catch (e) {
    next(e);
  }
};

exports.approveOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, { dealerApproved: true, status: 'ACTIVE' }, { new: true });
    res.json(offer);
  } catch (e) {
    next(e);
  }
};

exports.rejectOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, { dealerApproved: false, status: 'CLOSED' }, { new: true });
    res.json(offer);
  } catch (e) {
    next(e);
  }
};

exports.getPendingOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find({ status: 'PENDING_DEALER' });
    res.json(offers);
  } catch (e) {
    next(e);
  }
};

exports.assignCoupons = async (req, res, next) => {
  try {
    const { painterId, codes } = req.body;
    // Check if painter belongs to dealer
    const painter = await PainterProfile.findOne({ _id: painterId, dealerId: req.user.userId });
    if (!painter) throw new Error('Painter not found or not assigned to you');

    await require('../coupon/coupon.service').assignCouponsToPainter(painterId, codes);
    res.json({ message: 'Coupons assigned to painter' });
  } catch (e) {
    next(e);
  }
};