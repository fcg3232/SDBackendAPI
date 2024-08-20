const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const Joi = require("joi");
const express = require("express");
const generateAuthToken = require("../utils/generateAuthToken");
const router = express.Router();
const Web3 = require('web3');
require("dotenv").config();
const nodemailer = require("nodemailer");

const Infura_url = process.env.Infura;
const web3 = new Web3(Infura_url);

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

const createAccount = async () => {
  const newAccount = await web3.eth.accounts.create();
  return newAccount;
};

router.post("/", async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    phone: Joi.string().min(3).max(100).required(),
    email: Joi.string().min(3).max(200).required().email(),
    password: Joi.string().min(6).max(200).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already exists...");

  console.log("here");
  // const { name,phone, email, password, adminAddress, privateKey } = req.body;
  createAccount().then(async (ethereumAccount) => {
    user = new User({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
      walletAddress: ethereumAccount.address,
      privateKey: ethereumAccount.privateKey,
    })
    const mailOption = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: " SecondaryDAO | Wallet PrivateKey",
      text: `Dear Customer`,
      html: `<h3>Your Wallet PrivateKey.
      </h3>
      <br/>
      <p>Please Save this and import wallet address in our wallet.</p>
      <br/>
      <a> ${ethereumAccount.privateKey}</a>
       `,
    }
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.log("sending mail error", error)
        return res.status(400).send("sending mail error...");
      }
    })
  })
  // user = new User({ name,phone, email, password });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = generateAuthToken(user);

  res.send(token);
});

module.exports = router;
