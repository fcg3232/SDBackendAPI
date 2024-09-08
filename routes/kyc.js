const bcrypt = require("bcrypt");
const { Kyc } = require("../models/Kyc");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const moment = require("moment");
const router = require("express").Router();

//GET ALL USERS
router.get("/", isAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ _id: -1 });
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

//DELETE
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    res.status(200).send(deletedUser);
  } catch (error) {
    res.status(500).send(error);
  }
});


// GET USER
router.get("/find/:id", async (req, res) => {
  try {
    const kycCheck = await Kyc.findById(req.params.id);

    res.status(200).send({
      type: kycCheck.type,
      applicant_id: kycCheck.applicant_id,
      verification_id: kycCheck.verification_id,
      status: kycCheck.status,
      verified: kycCheck.verified,
      verifications: kycCheck.verifications,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/", async (req, res) => {
    try {
        const result = new Kyc({
            type: req.body.type,
            applicant_id: req.body.applicant_id,
            verification_id: req.body.verification_id,
            status: req.body.status,
            verified:req.body.verified,
            verifications:req.body.verifications,
        });
        const savedresult = await result.save();
        res.status(200).send(savedresult);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;
