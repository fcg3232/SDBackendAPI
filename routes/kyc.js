const bcrypt = require("bcrypt");
const { Kyc } = require("../models/Kyc");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const moment = require("moment");
const router = require("express").Router();
const crypto = require("crypto");
const { User } = require("../models/user");

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
  // Step 1: Ensure raw body is captured and exists
  const rawBody = req.body.toString("utf-8");
  if (!rawBody) {
    console.error("Raw body is undefined");
    return res.status(400).send("Raw body is missing");
  }

  // Step 2: Base64 encode the raw body
  const encodedBody = Buffer.from(rawBody, "utf-8").toString("base64");

  // Step 3: Create the HMAC SHA-512 hash using the encoded body and your API token
  const apiToken = "e31169640d9147493929ab77c9128470b16d"; // Replace with your actual API token
  const hmac = crypto.createHmac("sha512", apiToken);
  const calculatedHash = hmac.update(encodedBody).digest("hex");

  console.log("x-data-integrity header:", req.headers["x-data-integrity"]);
  console.log("Calculated hash:", calculatedHash);

  // Step 4: Compare the calculated hash with the x-data-integrity header
  if (req.headers["x-data-integrity"] === calculatedHash) {
    console.log("Callback verification successful");
    const { applicant_id, verification_status, verification_id } =
      JSON.parse(rawBody);
    try {
      // Step 5: Update or Create KYC Record in KYC Collection
      let kycRecord = await Kyc.findOneAndUpdate(
        { applicant_id: applicant_id },
        {
          verification_id: verification_id,
          status: verification_status,
        },
        { new: true, upsert: true } // Upsert ensures new KYC records are created if not found
      );

      if (!kycRecord) {
        kycRecord = await Kyc.create({
          applicant_id: applicant_id,
          verification_id: verification_id,
          status: verification_status,
        });
      }

      console.log("KYC verification updated in MongoDB:", kycRecord);

      // Step 6: Update the User Model to Reference the KYC Record
      const user = await User.findOneAndUpdate(
        { applicant_id: applicant_id }, // Assuming applicant_id is used in User collection
        { kycId: kycRecord._id }, // Update the user's kycId field to reference the KYC record
        { new: true }
      );

      if (!user) {
        console.error("User not found for applicant_id:", applicant_id);
        return res.status(404).send("User not found");
      }

      console.log("User KYC reference updated:", user);

      res.status(200).send("Callback received and processed");
    } catch (error) {
      console.error("Error processing KYC callback:", error);
      res.status(500).send("Error processing callback");
    }
  } else {
    console.error("Callback verification failed");
    res.status(400).send("Invalid callback signature");
  }
});

module.exports = router;
