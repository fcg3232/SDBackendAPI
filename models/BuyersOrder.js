const mongoose = require("mongoose");

const buyersSchema = new mongoose.Schema(
  {
    PropertyAddress:{ type: String, required: true},
    BuyersAddress: { type: String, required: true},
    Type_Of_Currency: { type: Number, required: true },
    Number_of_Tokens: { type: Number, required: true },
    Price_of_Tokens: { type: Number, required: true },
    Usdt_Usdc: { type: Number, required: true },
    r:{ type: String, required: true},
    s:{ type: String, required: true},
    v:{ type: Number, required: true},
    expireIn:{type: Number},
    Statue: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const BuyersOrder = mongoose.model("BuyersOrder", buyersSchema);

exports.BuyersOrder = BuyersOrder;
