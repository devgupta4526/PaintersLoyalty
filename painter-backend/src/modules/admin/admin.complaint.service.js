const Complaint = require('../complaint/complaint.model');

exports.getAllComplaints = async () => {
  return Complaint.find()
    .populate('userId')
    .sort({ createdAt: -1 });
};

exports.updateStatus = async (id, status, remark) => {
  return Complaint.findByIdAndUpdate(
    id,
    { status, adminRemark: remark },
    { new: true }
  );
};
