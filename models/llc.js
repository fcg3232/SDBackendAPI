const mongoose = require("mongoose");

const propllcSchema = new mongoose.Schema(
  {
    buildingtype: { type: String,required: true, minlength: 3, maxlength: 1240 },
    propstatus: { type: String,required: true, minlength: 3, maxlength: 1240 },
    rent:{ type: Number,required: true, minlength: 3, maxlength: 102400000 },
    propaddress: { type: String, required: true, minlength: 3, maxlength: 10240 },
    corpname:{ type: String, required: true, minlength: 3, maxlength: 50 },
    corptype:{ type: String, required: true, minlength: 3, maxlength: 1240 },
    regState:{ type: String, required: true, minlength: 3, maxlength: 1240 },
    corpId: { type: String, required: true, minlength: 3, maxlength: 200 },
    ein:{ type: String, required: true, minlength: 3, maxlength: 200 },
    incorporated:{ type: Date},
    mailingAddress:{ type: String, required: true, minlength: 3, maxlength: 10240 },
    regAgentAddress:{ type: String, required: true, minlength: 3, maxlength: 10240 },
    fileupload:{type: String},
    // active:{ type: Boolean, default: false },
    date: {type: Date, default: new Date()},
    // active: { type: String, required: true },
  },
  { timestamps: true }
);

const LLC = mongoose.model("LLC", propllcSchema);

exports.LLC = LLC;
