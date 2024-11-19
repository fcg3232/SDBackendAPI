const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    uid: {type: String},
    name: { type: String,required: true, minlength: 3, maxlength: 10240 },
    AdminWallet: {type: String, required: true},
    location: { type: String,required: true, minlength: 3, maxlength: 10240 },
    propertytype : { type: String,required: true, minlength: 3, maxlength: 10240 },
    bedroom:{ type: Number,required: true},
    bathroom:{ type: Number,required: true},
    area:{ type: Number,required: true},
    propaddress: { type: String, required: true, minlength: 3, maxlength: 10240 },
    date: {type: Date, default: new Date()},
    desc: { type: String},
    image: { type: Object, required: true },
    isStartSelling: { type: Boolean, default: false },
    isReStartSelling: { type: Boolean, default: false },
    tokenPrice: {type: Number},
    totalSupply:{type: Number},
    tokenBlance:{type: Number},
    listingfee:{type: Number},
    InitialReserves:{type: Number},
    purchasePrice:{type: Number},
    tokenHolder: {type: [Object]},
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", propertySchema);

exports.Product = Product;
