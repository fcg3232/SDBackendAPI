const mongoose = require("mongoose");

const sellersSchema = new mongoose.Schema(
  {
    PropertyAddress:{ type: String, required: true},
    SellersAddress: { type: String, required: true},
    Number_of_Tokens: { type: Number, required: true },
    Price_of_Tokens: { type: Number, required: true },
    r:{ type: String, required: true},
    s:{ type: String, required: true},
    v:{ type: Number, required: true},
    expireIn:{type: Number},
    Statue: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const SellersOrder = mongoose.model("SellersOrder", sellersSchema);

exports.SellersOrder = SellersOrder;
