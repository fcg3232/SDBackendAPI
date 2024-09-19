const mongoose = require("mongoose");

// Simplified Document Schema
const documentSchema = new mongoose.Schema({
  document_id: { type: String },
  type: { type: String },
  status: { type: String, default: "invalid" },
  decline_reasons: { type: [String], default: [] },
});

// Simplified Applicant Schema
const applicantSchema = new mongoose.Schema({
  applicant_id: { type: String, required: true },
  first_name: { type: String },
  last_name: { type: String },
  decline_reasons: { type: [String] },
  verification_status: { type: String },
  documents: { type: [documentSchema], default: [] },
});

const kycSchema = new mongoose.Schema({
  applicant_id: { type: String, required: true },
  verification_id: { type: String, default: null },
  status: { type: String, default: "unused" },
  verified: { type: Boolean, default: false },
  verification_attempts_left: { type: Number, default: -1 },
  type: { type: String },
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
  applicant: { type: applicantSchema },
  history: [
    {
      verification_id: { type: String, default: null },
      status: { type: String, default: "unused" },
      verified: { type: Boolean, default: false },
      // verification_attempts_left: { type: Number, required: true },
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
