const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 100 },
    phone: { type: String, required: true, minlength: 3, maxlength: 100 },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
      unique: true,
    },
    password: { type: String, required: true, minlength: 3, maxlength: 1024 },
    walletAddress: { type: String, required: true },
    privateKey: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isAccept: { type: Boolean, default: false },
    kycVerified: { type: Boolean, default: false },
    kycVerificationId: { type: String },
    kycFormUrl: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

exports.User = User;
