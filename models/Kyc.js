const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    applicant_id: { type: String, required: true },
    verification_id: { type: String, required: true },
    status:{ type: String, required: true },
    verified:{ type: Boolean, default: false },
    verifications:{ type: String, required: true },
  },
  { timestamps: true }
);

const Kyc = mongoose.model("Kyc", kycSchema);

exports.Kyc = Kyc;
