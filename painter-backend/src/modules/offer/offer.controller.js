const service = require('./offer.service');

exports.getOffers = async (req, res, next) => {
  try {
    res.json(await service.getOffersForPainter(req.user.userId));
  } catch (e) {
    next(e);
  }
};

exports.getInProgress = async (req, res, next) => {
  try {
    res.json(await service.getInProgressOffers(req.user.userId));
  } catch (e) {
    next(e);
  }
};

exports.getRedeemed = async (req, res, next) => {
  try {
    res.json(await service.getRedeemedOffers(req.user.userId));
  } catch (e) {
    next(e);
  }
};

exports.getClosed = async (req, res, next) => {
  try {
    res.json(await service.getClosedOffers(req.user.userId));
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

exports.getProgress = async (req, res, next) => {
  try {
    res.json(await service.getOfferProgress(req.user.userId, req.params.id));
  } catch (e) {
    next(e);
  }
};

exports.complete = async (req, res, next) => {
  try {
    res.json(await service.completeOffer(req.user.userId, req.params.id));
  } catch (e) {
    next(e);
  }
};
