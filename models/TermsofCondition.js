const mongoose = require("mongoose");

const termsSchema = new mongoose.Schema(
  {
    // usersId: { type: String, required: true },
    heading:{ type: String},
    desc: { type: String},
    // isAccept: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Terms = mongoose.model("Terms", termsSchema);

exports.Terms = Terms;
