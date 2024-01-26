const mongoose = require("mongoose");

const orderMatchingSchema = new mongoose.Schema(
  {
    orderId:{ type: String, required: true },
    PropertyAddress:{ type: String, required: true},
    BuyersAddress: { type: String, required: true},
    SellersAddress: { type: String, required: true},
    Type_Of_Currency: { type: Number},
    Property_Tokens: { type: Number, required: true },
    Calculate_Tokens: { type: Number},
    Price_of_Tokens: { type: Number,},
    Buyerfee:{ type: Number},
    Sellerfee:{ type: Number},
    IsBuyerApprove: { type: Boolean, default: false },
    IsSellerApprove: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const OrderMatching = mongoose.model("OrderMatching", orderMatchingSchema);

exports.OrderMatching = OrderMatching;
