const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  address: { type: String, required: true },
  active: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, minlength: 3, maxlength: 100 },
    last_name: { type: String, required: true, minlength: 3, maxlength: 100 },
    phone: { type: String, required: true, minlength: 3, maxlength: 100 },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
      unique: true,
    },
    dateofBirth: { type: Date, required: true },
    residence_country: { type: String, required: true },
    nationality: { type: String, required: true },
    password: { type: String, required: true, minlength: 3, maxlength: 1024 },
    walletAddress: { type: String, required: true },
    privateKey: { type: String, required: true },
    applicant_id: { type: String },
    verification_id: { type: String },
    isAdmin: { type: Boolean, default: false },
    isAccept: { type: Boolean, default: false },
    applicant_id: { type: String, default: null },
    verification_id: { type: String, default: null },
    wallets: [walletSchema],
    // kycId: { type: mongoose.Schema.Types.ObjectId, ref: "Kyc", default: null },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

exports.User = User;
