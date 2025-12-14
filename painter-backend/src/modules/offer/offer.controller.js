const service = require('./offer.service');

exports.getOffers = async (req, res, next) => {
  try {
    res.json(await service.getOffersForPainter(req.user.userId));
  } catch (e) {
    next(e);
  }
};

exports.join = async (req, res, next) => {
  try {
    res.json(
      await service.joinOffer(req.user.userId, req.params.id)
    );
  } catch (e) {
    next(e);
  }
};
