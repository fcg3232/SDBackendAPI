const express = require("express");
const berbix = require('berbix');
const { Berbix } = require("../models/Berbix");
const { auth, isUser, isAdmin } = require("../middleware/auth");
// const {Berbix} =
require("dotenv").config();
// const { auth, isUser, isAdmin } = require("../middleware/auth");


const router = express.Router();


const BerbixData = async (transactionTokens,customerUid) => {
    const newBerbixData = new Berbix({
        customerUid:customerUid,
        refreshToken: transactionTokens.refreshToken,
        access_token: transactionTokens.accessToken,
        client_token: transactionTokens.clientToken,
    });

    try {
        const savedBerbixData = await newBerbixData.save();
        console.log("Processed Berbix Data:", savedBerbixData);
    } catch (err) {
        console.log(err);
    }
};

const client = new berbix.Client({
    apiSecret: process.env.BERBIX_API_SECRET,
})


router.post("/create-transaction", async (req, res) => {

    const transactionTokens = await client.createTransaction({
        customerUid: req.body.userId,
        email: req.body.email,
        phone: req.body.phone,
        templateKey: process.env.BERBIX_TAMPLATE_KEY, // Template key for this transaction
    })
    // await transactionTokens.save();
    customerUid = req.body.userId
    BerbixData(transactionTokens, customerUid);
    console.log('Berbix data', transactionTokens)

    res.status(200).send(transactionTokens);
});



router.get("/", async (req, res, next) => {
    try {
        const berbixdatas = await Berbix.find().sort({ date: -1 });
        // const filteredprop = prop.filter(pro => pro.uid === req.user._id);
        // res.send(filteredprop);
        res.send(berbixdatas);
    } catch (error) {
        res.status(500).send("Error: " + error.message);
        winston.error(error.message);
    }
});

router.get("/find/:customerUid", async (req, res) => {
    try {
      const berbixs = await Berbix.find({ customerUid: req.params.customerUid });
    //   console.log("customerUid", req.body.customerUid)
    // findById
      res.status(200).send(berbixs);
    } catch (error) {
      res.status(500).send(error);
    }
  });

//   router.get("/find/:customerUid", isUser, async (req, res) => {
//     try {
//       const berbix = await Berbix.find({ customerUid: req.params.customerUid });
//       res.status(200).send(berbix);
//     } catch (err) {
//       res.status(500).send(err);
//     }
//   });
// berbix webhoook

router.post(
    "/webhook",
    express.json({ type: "application/json" }),
    async (req, res) => {
        const data = req.body;
        console.log("data", data)

        if (data.event === "Verification finished") {
            res.status(200).end();
            console.log("verification complete")
        }

        res.status(200).send(data);
    }
);

module.exports = router;
