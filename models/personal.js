// const { number } = require("joi");
const mongoose = require("mongoose");

const personalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, minlength: 3, maxlength: 200 },
    phone: { type: String, required: true, minlength: 3, maxlength: 200 },
    card:{ type: String, required: true, minlength: 3, maxlength: 200 },
    address: { type: String, required: true, minlength: 3, maxlength: 10240 },
    date: {type: Date, default: new Date()},
    author: {type:String},
    uid: {type: String},
  },
  // { timestamps: true }
);

const Personal = mongoose.model("Personal", personalSchema);

exports.Personal = Personal;
// module.exports.Property = Property;
// module.exports = Property;