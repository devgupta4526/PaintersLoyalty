const Offer = require('../offer/offer.model');

exports.createOffer = async (data, userId) => {
  return Offer.create({
    ...data,
    createdBy: userId
  });
};

exports.updateStatus = async (id, status) => {
  return Offer.findByIdAndUpdate(id, { status }, { new: true });
};

exports.getAll = async () => Offer.find().sort({ createdAt: -1 });
