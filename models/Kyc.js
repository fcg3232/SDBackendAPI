const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema({
  applicant_id: { type: String, required: true },
  verification_id: { type: String, default: null },
  status: { type: String, default: "unused" },
  verified: { type: Boolean, default: false },
  verification_attempts_left: { type: Number, required: true },
  verifications: {
    profile: {
      verified: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      decline_reasons: { type: [String], default: [] },
    },
    document: {
      verified: { type: Boolean, default: false },
      comment: { type: String, default: "" },
      decline_reasons: { type: [String], default: [] },
    },
  },

  history: [
    {
      verification_id: { type: String, default: null },
      status: { type: String, default: "unused" },
      verified: { type: Boolean, default: false },
      verification_attempts_left: { type: Number, required: true },
      verifications: {
        profile: {
          verified: { type: Boolean, default: false },
          comment: { type: String, default: "" },
          decline_reasons: { type: [String], default: [] },
        },
        document: {
          verified: { type: Boolean, default: false },
          comment: { type: String, default: "" },
          decline_reasons: { type: [String], default: [] },
        },
      },
      timestamp: { type: Date, default: Date.now },
    },
  ],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// const kycSchema = new mongoose.Schema(
//   {
//     type: { type: String, required: true },
//     applicant_id: { type: String, required: true },
//     verification_id: { type: String, required: true },
//     status: { type: String, required: true },
//     verified: { type: Boolean, default: false },
//     verifications: { type: String, required: true },
//     form_id: { type: String, required: true },
//     form_token: { type: String, required: true },
//     verification_attempts_left: { type: Number, required: true },
//   },
//   { timestamps: true }
// );

const Kyc = mongoose.model("Kyc", kycSchema);

exports.Kyc = Kyc;
