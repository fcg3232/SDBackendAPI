const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { Opt } = require("../models/opt");
const router = require("express").Router();



router.post("/", async (req, res) => {
  try {
    const data = await Opt.find({ email: req.body.email, code: req.body.code });
    console.log("change password data", data);
    if (data) {
      let currentTime = new Date().getTime();
      let time = data[0].expireIn - currentTime;
      if (time > 0) {
        const emailInUse = await User.findOne({ email: req.body.email });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        emailInUse.password = hashedPassword
        emailInUse.save();
        return res.status(200).send("Pasword change successfully");
      } else {
        console.log("OTP Expire")
        return res.status(400).send("OTP is Expired");
      }
    }else{
      return res.status(400).send("Enter a valid OTP");
    }

  } catch (error) {
    res.status(500).send(error);
  }
});


module.exports = router;