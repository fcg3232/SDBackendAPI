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
// router.get("/find/:id", async (req, res) => {
//   try {
//     const kycCheck = await Kyc.findById(req.params.id);

router.get("/find/:applicant_id", async (req, res) => {
  try {
    const kycCheck = await Kyc.findOne({
      applicant_id: req.params.applicant_id,
    });

    if (!kycCheck) {
      return res.status(404).send("KYC record not found");
    }

    res.status(200).send({
      type: kycCheck.type,
      applicant_id: kycCheck.applicant_id,
      verification_id: kycCheck.verification_id,
      status: kycCheck.status,
      verified: kycCheck.verified,
      verifications: kycCheck.verifications,
      applicant: kycCheck.applicant,
      verification_attempts_left: kycCheck.verification_attempts_left,
      verification_status: kycCheck.verification_status,
      history: kycCheck.history,
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
  const rawBody = req.rawBody.toString("utf-8");
  if (!rawBody) {
    console.error("Raw body is undefined");
    return res.status(400).send("Raw body is missing");
  }

  console.log("Received raw body:", rawBody);

  console.log("x-data-integrity header:", req.headers["x-data-integrity"]);

  const encodedBody = Buffer.from(rawBody, "utf-8").toString("base64");
  const apiToken = "e31169640d9147493929ab77c9128470b16d"; // Your actual API token
  const hmac = crypto.createHmac("sha512", apiToken);
  const calculatedHash = hmac.update(encodedBody).digest("hex");

  if (req.headers["x-data-integrity"] === calculatedHash) {
    console.log("Callback verification successful");
    console.log("Calculated hash:", calculatedHash);

    // Step 2: Handle different types of KYC callbacks
    const {
      type,
      applicant_id,
      verification_id,
      // verification_status,
      verification_attempts_left,
      status,
      verified,
      verification_status,
      verifications,
      applicant,
    } = JSON.parse(rawBody);

    try {
      console.log("JSON.parse(rawBody)", JSON.parse(rawBody));
      let kycRecord = await Kyc.findOne({ applicant_id: applicant_id });

      kycRecord.kyc_data = JSON.parse(rawBody);

      kycRecord.history.push({
        kyc_data: JSON.parse(rawBody), // Store the full callback in history
      });

      await User.findOneAndUpdate(
        { applicant_id: applicant_id }, // assuming applicant_id exists in User collection
        { applicant_id: applicant_id, verification_id: verification_id },
        { new: true }
      );

      return res.status(200).send("Verification status updated successfully.");

      // Step 3: Handle `VERIFICATION_STATUS_CHANGED`
      // if (type === "VERIFICATION_STATUS_CHANGED") {
      //   if (!kycRecord) {
      //     kycRecord = new Kyc({ applicant_id });
      //   }

      //   kycRecord.verification_id = verification_id;
      //   kycRecord.status = verification_status;
      //   kycRecord.type = type;
      //   kycRecord.verification_attempts_left =
      //     verification_attempts_left === "unlimited"
      //       ? -1
      //       : verification_attempts_left;

      //   // Add status change to history
      //   kycRecord.history.push({
      //     verification_id,
      //     status: verification_status,
      //     type: type,
      //     timestamp: new Date(),
      //     verification_attempts_left:
      //       verification_attempts_left === "unlimited"
      //         ? -1
      //         : verification_attempts_left,
      //   });

      //   await kycRecord.save();

      // await User.findOneAndUpdate(
      //   { applicant_id: applicant_id }, // assuming applicant_id exists in User collection
      //   { applicant_id: applicant_id, verification_id: verification_id },
      //   { new: true }
      // );

      //   console.log(
      //     "VERIFICATION_STATUS_CHANGED => Verification status updated successfully."
      //   );

      // return res
      //   .status(200)
      //   .send("Verification status updated successfully.");
      // }

      // Step 4: Handle `VERIFICATION_COMPLETED`
      // else if (type === "VERIFICATION_COMPLETED") {
      //   if (!kycRecord) {
      //     kycRecord = new Kyc({ applicant_id });
      //   }

      //   const profile = (verifications && verifications.profile) || {
      //     verified: false,
      //     comment: "",
      //     decline_reasons: [],
      //   };
      //   const document = (verifications && verifications.document) || {
      //     verified: false,
      //     comment: "",
      //     decline_reasons: [],
      //   };

      //   // Update KYC data
      //   kycRecord.verification_id = verification_id;
      //   kycRecord.status = status;
      //   kycRecord.type = type;
      //   kycRecord.verified = verified;
      //   kycRecord.verification_attempts_left =
      //     verification_attempts_left === "unlimited"
      //       ? -1
      //       : verification_attempts_left;

      //   // Conditionally update verifications only if the status is rejected
      //   if (status === "rejected") {
      //     kycRecord.verifications = { profile, document };
      //   }

      //   // Optionally store applicant info if provided
      //   if (applicant) {
      //     kycRecord.applicant = applicant;
      //   }

      //   // Add verification completion to history
      //   kycRecord.history.push({
      //     verification_id,
      //     status: status,
      //     verifications: { profile, document },
      //     timestamp: new Date(),
      //     type: type,
      //     verification_attempts_left:
      //       verification_attempts_left === "unlimited"
      //         ? -1
      //         : verification_attempts_left,
      //   });

      //   await kycRecord.save();

      //   await User.findOneAndUpdate(
      //     { applicant_id: applicant_id }, // assuming applicant_id exists in User collection
      //     { applicant_id: applicant_id, verification_id: verification_id },
      //     { new: true }
      //   );

      //   console.log(
      //     "VERIFICATION_COMPLETED => Verification completed and updated successfully."
      //   );
      // return res
      //   .status(200)
      //   .send("Verification completed and updated successfully.");
      // }

      // Step 5: Handle unknown callback types
      // else {
      //   console.error(`Unknown callback type: ${type}`);
      //   return res.status(400).send(`Unknown callback type: ${type}`);
      // }
    } catch (error) {
      console.error("Error processing KYC callback:", error);
      return res.status(500).send("Error processing callback");
    }
  } else {
    console.error("Callback verification failed");
    return res.status(400).send("Invalid callback signature");
  }
});

// router.post("/kyc-callback", async (req, res) => {
// // Step 1: Ensure raw body is captured and exists
// const rawBody = req.body.toString("utf-8");
// if (!rawBody) {
//   console.error("Raw body is undefined");
//   return res.status(400).send("Raw body is missing");
// }

// // Step 2: Base64 encode the raw body
// const encodedBody = Buffer.from(rawBody, "utf-8").toString("base64");

// // Step 3: Create the HMAC SHA-512 hash using the encoded body and your API token
// const apiToken = "e31169640d9147493929ab77c9128470b16d"; // Replace with your actual API token
// const hmac = crypto.createHmac("sha512", apiToken);
// const calculatedHash = hmac.update(encodedBody).digest("hex");

// console.log("x-data-integrity header:", req.headers["x-data-integrity"]);
// console.log("Calculated hash:", calculatedHash);

//   // Step 4: Compare the calculated hash with the x-data-integrity header
//   if (req.headers["x-data-integrity"] === calculatedHash) {
//     console.log("Callback verification successful");
//     const {
//       applicant_id,
//       verification_status,
//       verification_id,
//       verification_attempts_left,
//       verifications,
//     } = JSON.parse(rawBody);
//     // Step 5: Safely handle missing verifications object
//     const profile = (verifications && verifications.profile) || {
//       verified: false,
//       comment: "",
//       decline_reasons: [],
//     };
//     const document = (verifications && verifications.document) || {
//       verified: false,
//       comment: "",
//       decline_reasons: [],
//     };

//     try {
//       // Find the current KYC record for the user
//       let kycRecord = await Kyc.findOne({ applicant_id: applicant_id });

//       // If there's an existing KYC record, move the current data to the history
//       if (kycRecord) {
//         kycRecord.history.push({
//           verification_id: kycRecord.verification_id,
//           status: kycRecord.status,
//           verified: kycRecord.verified,
//           verifications: kycRecord.verifications,
//           verification_attempts_left: kycRecord.verification_attempts_left,
//           timestamp: new Date(),
//         });
//       } else {
//         // If no KYC record exists, create a new one
//         kycRecord = new Kyc({ applicant_id: applicant_id });
//       }

//       // Update the current KYC data
//       kycRecord.verification_id = verification_id;
//       kycRecord.status = verification_status;
//       kycRecord.verified = profile.verified && document.verified; // or other logic for verified status
//       kycRecord.verifications = { profile, document };

//       // Save the updated KYC record
//       await kycRecord.save();

//       console.log("KYC verification updated in MongoDB:", kycRecord);

//       // Step 6: Update the User Model to Reference the KYC Record
//       const user = await User.findOneAndUpdate(
//         { applicant_id: applicant_id },
//         { kycId: kycRecord._id }, // Set the user's kycId field to reference the KYC record
//         { new: true }
//       );

//       if (!user) {
//         console.error("User not found for applicant_id:", applicant_id);
//         return res.status(404).send("User not found");
//       }

//       console.log("User KYC reference updated:", user);
//       res.status(200).send("Callback received and processed");
//     } catch (error) {
//       console.error("Error processing KYC callback:", error);
//       res.status(500).send("Error processing callback");
//     }
//   } else {
//     console.error("Callback verification failed");
//     res.status(400).send("Invalid callback signature");
//   }
// });

module.exports = router;
