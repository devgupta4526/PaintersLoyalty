const service = require('./admin.complaint.service');

exports.getAll = async (req, res, next) => {
  try {
    const data = await service.getAllComplaints();
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { status, remark } = req.body;
    const data = await service.updateStatus(
      req.params.id,
      status,
      remark
    );
    res.json(data);
  } catch (e) {
    next(e);
  }
};

