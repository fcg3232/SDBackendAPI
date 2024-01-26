// const { number } = require("joi");
const mongoose = require("mongoose");

const propertydbSchema = new mongoose.Schema(
  {
    buildingtype: { type: String,required: true, minlength: 3, maxlength: 10240 },
    propstatus: { type: String,required: true, minlength: 3, maxlength: 10240 },
    rent:{ type: Number,required: true, minlength: 3, maxlength: 102400000 },
    propaddress: { type: String, required: true, minlength: 3, maxlength: 10240 },
    active:{ type: Boolean, default: false },
    date: {type: Date, default: new Date()},
    author: {type:String},
    uid: {type: String},
  },
  // { timestamps: true }
);

const Propertydb = mongoose.model("Propertydb", propertydbSchema);

exports.Propertydb = Propertydb;
// module.exports.Property = Property;
// module.exports = Property;