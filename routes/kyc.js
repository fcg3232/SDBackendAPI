const bcrypt = require("bcrypt");
const { Kyc } = require("../models/Kyc");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const moment = require("moment");
const router = require("express").Router();
const crypto = require("crypto");

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
      verified: req.body.verified,
      verifications: req.body.verifications,
    });
    const savedresult = await result.save();
    res.status(200).send(savedresult);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/kyc-callback", async (req, res) => {
  const hmac = crypto.createHmac(
    "sha512",
    "e31169640d9147493929ab77c9128470b16d"
  );
  const rawBody = JSON.stringify(req.body);
  const signature = hmac.update(Buffer.from(rawBody, "utf-8")).digest("hex");

  if (req.headers["x-data-integrity"] === signature) {
    console.log("Callback verification successful");

    const { applicant_id, verification_status, verification_id } = req.body;
    try {
      // Use findOneAndUpdate to update the existing record
      const updatedKyc = await Kyc.findOneAndUpdate(
        { applicant_id: applicant_id },
        {
          // status: verification_status,
          // verification_id: verification_id,
          // verified: true,
          applicant_id: applicant_id,
          verification_id: verification_id,
          status: verification_status,
        },
        { new: true, upsert: false } // Return the updated document, and don't insert a new one if not found
      );

      if (!updatedKyc) {
        return res.status(404).send("KYC record not found");
      }

      console.log("KYC verification updated in MongoDB:", updatedKyc);
      res.status(200).send("Callback received and processed");
    } catch (error) {
      console.error("Error updating KYC verification:", error);
      res.status(500).send("Error processing callback");
    }
  } else {
    console.error("Callback verification failed");
    res.status(400).send("Invalid callback signature");
  }
});

module.exports = router;
