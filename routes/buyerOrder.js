const { BuyersOrder } = require("../models/BuyersOrder");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const moment = require("moment");
const router = require("express").Router();

router.post("/", async (req, res) => {
    try {
        const order = new BuyersOrder({
            PropertyAddress: req.body.PropertyAddress,
            BuyersAddress: req.body.BuyersAddress,
            Type_Of_Currency: req.body.Type_Of_Currency,
            Number_of_Tokens: req.body.Number_of_Tokens,
            Price_of_Tokens: req.body.Price_of_Tokens,
            expireIn: new Date().getTime() + 864000 * 1000,
            Statue: req.body.Statue,
        });
        const savedorder = await order.save();
        res.status(200).send(savedorder);
    } catch (error) {
        res.status(500).send(error);
    }
})

//UPDATE
router.put("/:id",isUser, async (req, res) => {
    try {
      const updatedOrder = await BuyersOrder.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).send(updatedOrder);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  //DELETE
router.delete("/:id",isAdmin, async (req, res) => {
    try {
      await BuyersOrder.findByIdAndDelete(req.params.id);
      res.status(200).send("Order has been deleted...");
    } catch (err) {
      res.status(500).send(err);
    }
  });

  //GET USER ORDERS
router.get("/fetch/:id", async (req, res) => {
    try {
      const orders = await BuyersOrder.find({ _id: req.params.id });
      res.status(200).send(orders);
    } catch (err) {
      res.status(500).send(err);
    }
  });

    //GET USER ORDERS
router.get("/findID/:BuyersAddress", async (req, res) => {
  try {
    const orders = await BuyersOrder.find({ BuyersAddress: req.params.BuyersAddress });
    res.status(200).send(orders);
  } catch (err) {
    res.status(500).send(err);
  }
});

     //GET Property ORDERS 
router.get("/find/:PropertyAddress", async (req, res) => {
  try {
    const orders = await BuyersOrder.find({ PropertyAddress: req.params.PropertyAddress });
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
          products = await BuyersOrder.find({
            location: qlocation,
          }).sort({ _id: -1 });
        } else {
          orders = await BuyersOrder.find().sort({ _id: -1 });
        }
    
        res.status(200).send(orders);
    } catch (err) {
      res.status(500).send(err);
    }
  });


  module.exports = router;