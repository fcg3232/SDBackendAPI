const express = require("express");
const nodemailer = require("nodemailer");
const { Opt } = require("../models/opt");
const { User } = require("../models/user");
require("dotenv").config();
const router = express.Router();


let transporter = nodemailer.createTransport({
  // host: "smtp.ethereal.email",
  // port: 587,
  secure: true, // true for 465, false for other ports
  // host: "gmail",
  port: 465,
  host: "smtp.gmail.com",
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // generated ethereal user
    pass: process.env.PASS, // generated ethereal password
  },
});


router.get("/", async (req, res, next) => {
  try {
      const optdata = await Opt.find().sort({ date: -1 });
      // const filteredprop = prop.filter(pro => pro.uid === req.user._id);
      // res.send(filteredprop);
      res.send(optdata);
  } catch (error) {
      res.status(500).send("Error: " + error.message);
      winston.error(error.message);
  }
});


router.post("/", async (req, res) => {

  let data = await User.findOne({ email: req.body.email });
  if (data) {
    let optcode = Math.floor((Math.random() * 10000) + 1);
    let ExistEmail = await Opt.findOne({ email: req.body.email });
    if (ExistEmail) {
      const updatData = await Opt.findByIdAndUpdate({ _id: ExistEmail._id },
        {
          code: optcode,
          expireIn: new Date().getTime()+300*1000
        }, { new: true });
      await updatData.save();
      const mailOption = {
        from: process.env.EMAIL,
        to: req.body.email,
        subject: "SecondaryDAO | One Time Password (OTP)",
        text: `Dear Customer`,
        html: `<b>${optcode} is your One Time Password (OTP). Note that this password will expire after 2 minutes.</b>`, 
      }
      transporter.sendMail(mailOption, (error, info) => {
        if (error) {
          console.log("sending mail error", error)
          return res.status(400).send("sending mail error...");
        } else {
          return res.status(200).send("Please Check you email");
        }
      })
      // return res.status(400).send("Please Check you email");
    } else {
      let Optdata = new Opt({
        email: req.body.email,
        code: optcode,
        expireIn: new Date().getTime() + 300 * 1000
      })
      console.log("DATA SEND:", optcode);
      await Optdata.save();
      // return res.status(200).send("Please Check you email");
      const mailOption = {
        from: process.env.EMAIL,
        to: req.body.email,
        subject:" SecondaryDAO | One Time Password (OTP)",
        text: `Dear Customer`,
        html: `<b> ${optcode} is your One Time Password (OTP). Note that this password will expire after 2 minutes.</b>`, 
      }
      transporter.sendMail(mailOption, (error, info) => {
        if (error) {
          console.log("sending mail error", error)
          return res.status(400).send("sending mail error...");
        } else {
          return res.status(200).send("Please Check you email");
        }
      })
    }
    // let Optdata = new Opt({
    //   email: req.body.email,
    //   code: optcode,
    //   expireIn: new Date().getTime() + 300 * 1000
    // })
    // console.log("DATA SEND:", optcode);
    // let otpResponse = await Optdata.save();
    // return res.status(400).send("Please Check you email");
  } else {
    return res.status(400).send("Invalid email or password...");
  }

});


module.exports = router;
