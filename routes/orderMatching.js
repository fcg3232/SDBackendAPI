const { OrderMatching } = require("../models/OrderMatching");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const router = require("express").Router();
const { BuyersOrder } = require("../models/BuyersOrder");
const { SellersOrder } = require("../models/SellersOrder");
const { User } = require("../models/user");
require("dotenv").config();
const nodemailer = require("nodemailer");

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

router.post("/", async (req, res) => {
    try {
        const ord = await BuyersOrder.findById(req.body.orderId);
        const orders = await SellersOrder.findById(req.body.orderId);
        if (ord) {
            let Buyer = await User.findOne({ walletAddress: req.body.BuyersAddress });
            if(Buyer != null){
                const order = new OrderMatching({
                    orderId: req.body.orderId,
                    PropertyAddress: req.body.PropertyAddress,
                    BuyersAddress: req.body.BuyersAddress,
                    SellersAddress: req.body.SellersAddress,
                    Type_Of_Currency: req.body.Type_Of_Currency,
                    Property_Tokens: req.body.Property_Tokens,
                    Calculate_Tokens: req.body.Calculate_Tokens,
                    Price_of_Tokens: req.body.Price_of_Tokens,
                    Buyerfee: req.body.Buyerfee,
                    Sellerfee: req.body.Sellerfee,
                });
                const mailOption = {
                    from: process.env.EMAIL,
                    to: Buyer.email,
                    subject: " SecondaryDAO | Fund Approval Request",
                    text: `Dear Buyers`,
                    html: `<h3>You Need to approve the Seller Request. 
                    </h3>
                    <br/>
                    <a> Order ID: ${req.body.orderId}</a>
                    <br/>
                    <a> Request for Approval Tokens: ${(req.body.Property_Tokens)/10**18}</a>
                    <br/>
                    <a> Platform fee: ${(req.body.Buyerfee)/10**8}</a>
                    <br/>
                    <a> Seller Address: ${req.body.SellersAddress}</a>
                    <br/>
                    <p>Please visit <a href="https://app.secondarydao.com">SecondaryDAO Dashboard</a>.</p>
                    <br/>
                     `,
                }
                transporter.sendMail(mailOption, (error, info) => {
                    if (error) {
                        console.log("sending mail error", error)
                        return res.status(400).send("sending mail error...");
                    } else {
                        return res.status(200).send("Please check you email");
                    }
                })
                const savedorders = await order.save();
                res.status(200).send(savedorders);
                console.log("Buyer", Buyer)
            }
        }
        if (orders) {
            Seller = await User.findOne({ walletAddress: req.body.SellersAddress });
            if(Seller){
                const order = new OrderMatching({
                    orderId: req.body.orderId,
                    PropertyAddress: req.body.PropertyAddress,
                    BuyersAddress: req.body.BuyersAddress,
                    SellersAddress: req.body.SellersAddress,
                    Type_Of_Currency: req.body.Type_Of_Currency,
                    Property_Tokens: req.body.Property_Tokens,
                    Calculate_Tokens: req.body.Calculate_Tokens,
                    Buyerfee: req.body.Buyerfee,
                    Sellerfee: req.body.Sellerfee,
                });
                const mailOption = {
                    from: process.env.EMAIL,
                    to: Seller.email,
                    subject: " SecondaryDAO | Fund Approval Request",
                    text: `Dear Seller`,
                    html: `<h3>You Need to approve the Buyers Request. 
                    </h3>
                    <br/>
                    <a> Order ID: ${req.body.orderId}</a>
                    <br/>
                    <a> Request for Approval Tokens: ${(req.body.Property_Tokens)/10**18}</a>
                    <br/>
                    <a> Platform fee: ${(req.body.Sellerfee)/10**18}</a>
                    <br/>
                    <a> Buyer Address: ${req.body.BuyersAddress}</a>
                    <br/>
                    <p>Please visit <a href="https://app.secondarydao.com">SecondaryDAO Dashboard</a>.</p>
                    <br/>
                     `,
                }
                transporter.sendMail(mailOption, (error, info) => {
                    if (error) {
                        console.log("sending mail error", error)
                        return res.status(400).send("sending mail error...");
                    } else {
                        return res.status(200).send("Please Check you email");
                    }
                })
                const savedorder = await order.save();
                res.status(200).send(savedorder);
            }
        }
    } catch (error) {
        res.status(500).send(error);
    }
})

//UPDATE
router.put("/approve/:id",isAdmin, async (req, res) => {
    try {
        const Morder = await OrderMatching.findById(req.params.id);
        if (Morder) {
            const order = await BuyersOrder.findById(Morder.orderId);
            const orders = await SellersOrder.findById(Morder.orderId);
            if(order){
                Seller = await User.findOne({ walletAddress: Morder.SellersAddress });
                const updatedOrder = await OrderMatching.findByIdAndUpdate(
                    req.params.id,
                    {
                        IsBuyerApprove: true,
                    },
                    { new: true }
                );
                const mailOption = {
                    from: process.env.EMAIL,
                    to: Seller.email,
                    subject: " SecondaryDAO | Buyer Approval Request",
                    text: `Dear Buyers`,
                    html: `<h3>You Need to Send the tokens to Buyers. 
                    </h3>
                    <br/>
                    <a> Order No.: ${Morder.orderId}</a>
                    <br/>
                    <a> Request for Approval Tokens: ${Morder.Property_Tokens}</a>
                    <br/>
                    <p>Please visit SecondaryDAO Dashboard.</p>
                    <br/>
                     `,
                }
                transporter.sendMail(mailOption, (error, info) => {
                    if (error) {
                        console.log("sending mail error", error)
                        return res.status(400).send("sending mail error...");
                    } else {
                        return res.status(200).send("Please Check you email");
                    }
                })
                res.status(200).send(updatedOrder);
            }
            if(orders){
                  let Buyer = await User.findOne({ walletAddress: order.BuyersAddress });
                  const updatedOrder = await OrderMatching.findByIdAndUpdate(
                      req.params.id,
                      {
                          IsSellerApprove: true
                      },
                      { new: true }
                  );
                  const mailOption = {
                      from: process.env.EMAIL,
                      to: Buyer.email,
                      subject: " SecondaryDAO | Buyer Approval Request",
                      text: `Dear Buyers`,
                      html: `<h3>You Need to Send the tokens to Buyers. 
                      </h3>
                      <br/>
                      <a> Order No.: ${Morder.orderId}</a>
                      <br/>
                      <a> Request for Approval Tokens: ${Morder.Property_Tokens}</a>
                      <br/>
                      <p>Please visit SecondaryDAO Dashboard.</p>
                      <br/>
                       `,
                  }
                  transporter.sendMail(mailOption, (error, info) => {
                      if (error) {
                          console.log("sending mail error", error)
                          return res.status(400).send("sending mail error...");
                      } else {
                          return res.status(200).send("Please Check you email");
                      }
                  })
                  res.status(200).send(updatedOrder);
            }
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

//DELETE
router.delete("/:id", async (req, res) => {
    try {
        await OrderMatching.findByIdAndDelete(req.params.id);
        res.status(200).send("Order has been deleted...");
    } catch (err) {
        res.status(500).send(err);
    }
});

//GET Property ORDERS 
router.get("/find/:PropertyAddress", async (req, res) => {
    try {
        const orders = await OrderMatching.find({ PropertyAddress: req.params.PropertyAddress });
        res.status(200).send(orders);
    } catch (err) {
        res.status(500).send(err);
    }
});

//GET USER ORDERS
router.get("/findbuyer/:address", async (req, res) => {
    try {
        const order = await OrderMatching.find({ BuyersAddress: req.params.address });
            res.status(200).send(order);
    } catch (err) {
        res.status(500).send(err);
    }
});
//GET USER ORDERS
router.get("/findSeller/:address", async (req, res) => {
    try {
        const orders = await OrderMatching.find({ SellersAddress: req.params.address });
            res.status(200).send(orders);
    } catch (err) {
        res.status(500).send(err);
    }
});

//GET ALL ORDERS

router.get("/", async (req, res) => {
    // const query = req.query.new;
    const qlocation = req.query.location;
    try {
        // const orders = query
        //   ? await BuyersOrder.find().sort({ _id: -1 }).limit(4)
        //   : await BuyersOrder.find().sort({ _id: -1 });
        // res.status(200).send(orders);
        let orders;

        if (qlocation) {
            products = await OrderMatching.find({
                location: qlocation,
            }).sort({ _id: -1 });
        } else {
            orders = await OrderMatching.find().sort({ _id: -1 });
        }

        res.status(200).send(orders);
    } catch (err) {
        res.status(500).send(err);
    }
});


module.exports = router;