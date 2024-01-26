const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    uid: {type: String},
    name: { type: String,required: true, minlength: 3, maxlength: 10240 },
    location: { type: String,required: true, minlength: 3, maxlength: 10240 },
    propertytype : { type: String,required: true, minlength: 3, maxlength: 10240 },
    bedroom:{ type: Number,required: true},
    bathroom:{ type: Number,required: true},
    area:{ type: Number,required: true},
    propaddress: { type: String, required: true, minlength: 3, maxlength: 10240 },
    date: {type: Date, default: new Date()},
    desc: { type: String},
    image: { type: Object, required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

exports.Product = Product;
