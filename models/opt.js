const mongoose = require("mongoose");

const optSchema = new mongoose.Schema(
  {
    email: { type: String},
    code: { type: String},
    expireIn:{type: Number}
  },
  { timestamps: true }
);

const Opt = mongoose.model("Opt", optSchema);

exports.Opt = Opt;
