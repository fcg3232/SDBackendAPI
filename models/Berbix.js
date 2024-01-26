const mongoose = require("mongoose");

const berbixSchema = new mongoose.Schema(
  {
    // customer_uid
    customerUid: { type: String, required: true },
    refreshToken: { type: String, required: true },
    access_token: { type: String, required: true },
    client_token: { type: String, required: true },
  },
  { timestamps: true }
);

const Berbix = mongoose.model("Berbix", berbixSchema);

exports.Berbix = Berbix;
