const { BuyersOrder } = require("../models/BuyersOrder");
const { Product } = require("../models/product");
const { User } = require("../models/user");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const moment = require("moment");
const router = require("express").Router();
const Infura_url = process.env.Infura;
const ContractAddress = process.env.CONTRACT_ADDRESS;
const Web3 = require('web3');
const web3 = new Web3(Infura_url);
const ContractABI = require("../contract/SecondaryDAO.json");
const USDTabi = require("../contract/USDT.json");
const USDTContractAddress = process.env.USDTADDRESS;
const USDTADDRESS = "0x32Af54FF4Fc6341064410A9bE1cAf74E43119B47";

router.post("/", async (req, res) => {
  try {
    const order = new BuyersOrder({
      PropertyAddress: req.body.PropertyAddress,
      BuyersAddress: req.body.BuyersAddress,
      Type_Of_Currency: req.body.Type_Of_Currency,
      Number_of_Tokens: req.body.Number_of_Tokens,
      Price_of_Tokens: req.body.Price_of_Tokens,
      Usdt_Usdc: req.body.Usdt_Usdc,
      r: req.body.r,
      s: req.body.s,
      v: req.body.v,
      expireIn: req.body.expireIn,
      // expireIn: new Date().getTime() + 864000 * 1000,
      Statue: req.body.Statue,
    });
    const savedorder = await order.save();
    res.status(200).send(savedorder);
  } catch (error) {
    res.status(500).send(error);
  }
})

//UPDATE
router.put("/:id", isUser, async (req, res) => {
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

router.patch("/:id", async (req, res) => {
  try {
    const ord = await BuyersOrder.findById(req.params.id);
    if (!ord) return res.status(404).send("Buyer not found...");
    const orders = await Product.findOne({ PropertyAddress: ord.PropertyAddress });
    const fromUser = await User.findOne({ walletAddress: orders.AdminWallet });
    if (!orders) return res.status(404).send("Property Address not found...");
    const USDTContract = new web3.eth.Contract(USDTabi, USDTADDRESS);
    console.log("v", ord.v)
    console.log("s", ord.s)
    console.log("r", ord.r)
    if (!USDTContract) return res.status(404).send("USDT Contract not found...");
    let approval = await USDTContract?.methods.permit(
      ord.BuyersAddress,
      orders.AdminWallet,
      ord.Usdt_Usdc,
      ord.expireIn,
      ord.v,
      ord.r,
      ord.s,
      );
      const encodedABI = approval.encodeABI();
      web3.eth.estimateGas({
        from: orders.AdminWallet,
        to: USDTADDRESS,
        data: encodedABI
      })
      .then(gasEstimate => {
	      console.log('Gas estimate:', gasEstimate);
	      const transactionAdmin = {
	        from: orders.AdminWallet, // Replace with your Ethereum address
	        to: USDTADDRESS, // Replace with your smart contract address
	        gas: gasEstimate, // Set an appropriate gas limit
	        data: encodedABI // Include the encoded ABI data here
	      };
	      web3.eth.accounts.signTransaction(transactionAdmin, fromUser.privateKey)
	      .then(signedTx => {
	        return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
	      }).then(async (receipt) => {
	        console.log('Transaction receipt:', receipt);
          const updatedord = await BuyersOrder.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
              new: true,
            }
          );
          res.send(updatedord);
        })
      })

  } catch (error) {
    res.status(500).send("Error: " + error.message);
    console.log(error.message);
  }

});

//DELETE
router.delete("/:id", isAdmin, async (req, res) => {
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