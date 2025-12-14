const Offer = require('./offer.model');
const Participation = require('./offer.participation.model');

exports.getOffersForPainter = async (userId) => {
  const offers = await Offer.find({
    status: 'ACTIVE',
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
  if (!offer || offer.status !== 'ACTIVE')
    throw new Error('Offer not available');

  return Participation.create({
    userId,
    offerId,
    progress: {
      requiredLitres: offer.eligibility.minLitres
    }
  });
};
