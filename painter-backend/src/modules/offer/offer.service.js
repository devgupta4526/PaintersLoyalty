const Offer = require('./offer.model');
const Participation = require('./offer.participation.model');

exports.getOffersForPainter = async (userId) => {
  const offers = await Offer.find({
    status: 'ACTIVE',
    dealerApproved: true, // Only show dealer-approved offers
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() }
  });

  const participations = await Participation.find({ userId });

  return offers.map(o => {
    const p = participations.find(
      x => x.offerId.toString() === o._id.toString()
    );
    return {
      ...o.toObject(),
      participation: p || null
    };
  });
};


exports.joinOffer = async (userId, offerId) => {
  const offer = await Offer.findById(offerId);
  if (!offer || offer.status !== 'ACTIVE' || !offer.dealerApproved)
    throw new Error('Offer not available');

  return Participation.create({
    userId,
    offerId,
    progress: {
      requiredLitres: offer.eligibility.minLitres
    }
  });
};

exports.getInProgressOffers = async (userId) => {
  const participations = await Participation.find({ userId, status: 'IN_PROGRESS' }).populate('offerId');
  return participations.map(p => ({
    ...p.offerId.toObject(),
    participation: p
  }));
};

exports.getRedeemedOffers = async (userId) => {
  const participations = await Participation.find({ userId, status: 'COMPLETED' }).populate('offerId');
  return participations.map(p => ({
    ...p.offerId.toObject(),
    participation: p
  }));
};

exports.getClosedOffers = async (userId) => {
  const offers = await Offer.find({
    status: 'CLOSED',
    endDate: { $lt: new Date() }
  });
  return offers;
};

exports.getOfferProgress = async (userId, offerId) => {
  const participation = await Participation.findOne({ userId, offerId }).populate('offerId');
  return participation;
};

exports.completeOffer = async (userId, offerId) => {
  const participation = await Participation.findOneAndUpdate(
    { userId, offerId },
    { status: 'COMPLETED', completedAt: new Date() },
    { new: true }
  );
  return participation;
};
