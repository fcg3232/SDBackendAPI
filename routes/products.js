const { Product } = require("../models/product");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const cloudinary = require("../utils/cloudinary");
const Web3 = require('web3');
const router = require("express").Router();
const { User } = require("../models/user");

const Infura_url = process.env.Infura;
const ContractAddress = process.env.CONTRACT_ADDRESS;
const walletAddresss = process.env.address ;
const web3 = new Web3(Infura_url);
const ContractABI = require("../contract/SecondaryDAO.json");
const EscrowABI = require("../contract/Escrow.json");
const PropertyABI = require("../contract/Property.json");
const USDCaddr = "0x0153002d20B96532C639313c2d54c3dA09109309";
const USDTaddr = "0x80EDee6f667eCc9f63a0a6f55578F870651f06A4";

const aggregatorV3InterfaceABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "description",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
    name: "getRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
]
// updated token price
router.get("/update/:id", isAdmin, async (req, res) => {
  const EscrowContract = new web3.eth.Contract(EscrowABI, req.params.id);
  if (!EscrowContract) return res.status(404).send("Escrow Address not found...");
  try {
    let tokenPriceUpdate = await EscrowContract?.methods.updatedTokenPrice();
    const encodedABI = tokenPriceUpdate.encodeABI();
    web3.eth.estimateGas({
      from: AdminWallet.walletAddress,
      to: req.params.id,
      data: encodedABI
    })
      .then(gasEstimate => {
        const transactionAdmin = {
          from: AdminWallet.walletAddress, // Replace with your Ethereum address
          to: req.params.id, // Replace with your smart Escrow contract address
          gas: gasEstimate, // Set an appropriate gas limit
          data: encodedABI // Include the encoded ABI data here
        };
        web3.eth.accounts.signTransaction(transactionAdmin, AdminWallet.privateKey)
          .then(signedTx => {
            return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
          })
          .then(async (receipt) => {
            res.status(200).send(receipt);
            console.log('Token Price Updated receipt:', receipt);
          })
      })
  } catch (error) {
    console.log("Token Price Updated Error", error);
    res.status(500).send(error);
  }
})
//CREATE
router.post("/:id", isAdmin, async (req, res) => {
  const AdminWallet = await User.findById(req.params.id);
  if (!AdminWallet) return res.status(404).send("User/Admin wallet not found...");
  const { uid, name, location, propertytype, bedroom, bathroom, area, propaddress, date, desc, image } = req.body;
  const realEstateContract = new web3.eth.Contract(ContractABI, ContractAddress);
  try {
    let Propertytoken = await realEstateContract?.methods.CreateProperty(req.body.name);
    const encodedABI = Propertytoken.encodeABI();
    web3.eth.estimateGas({
      from: AdminWallet.walletAddress,
      to: ContractAddress,
      data: encodedABI
    })
      .then(gasEstimate => {
        console.log('Gas estimate:', gasEstimate);
        const transactionAdmin = {
          from: AdminWallet.walletAddress, // Replace with your Ethereum address
          to: ContractAddress, // Replace with your smart contract address
          gas: gasEstimate, // Set an appropriate gas limit
          data: encodedABI // Include the encoded ABI data here
        };
        web3.eth.accounts.signTransaction(transactionAdmin, AdminWallet.privateKey)
          .then(signedTx => {
            return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
          })
          .then(async (receipt) => {
            console.log('Transaction receipt:', receipt);
            let PropertyAdd = await realEstateContract?.methods.PropertyAddress().call({ from: AdminWallet.walletAddress });
            console.error('Property Address:', receipt);

            if (image) {
              const uploadedResponse = await cloudinary.uploader.upload(image, {
                upload_preset: "almonivepk",
              });

              if (uploadedResponse) {
                const product = new Product({
                  uid: PropertyAdd,
                  name: req.body.name,
                  AdminWallet: AdminWallet.walletAddress,
                  location: req.body.location,
                  propertytype: req.body.propertytype,
                  bedroom: req.body.bedroom,
                  bathroom: req.body.bathroom,
                  area: req.body.area,
                  propaddress: req.body.propaddress,
                  date: req.body.date,
                  desc: req.body.desc,
                  image: uploadedResponse,
                });

                const savedProduct = await product.save();
                res.status(200).send(savedProduct);
              }
            }
          })
          .catch(error => {
            console.error('Transaction error:', error);
          });
      })
      .catch(error => {
        console.error('Error estimating gas:', error);
      });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//DELETE

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).send("Product not found...");

    if (product.image.public_id) {
      const destroyResponse = await cloudinary.uploader.destroy(
        product.image.public_id
      );

      if (destroyResponse) {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        res.status(200).send(deletedProduct);
      }
    } else {
      console.log("Action terminated. Failed to deleted product image...");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});


router.patch("/order/:id", async (req, res) => {
  try {
    const ord = await Product.findById(req.params.id);
    if (!ord) return res.status(404).send("Not found...");
    const fromUser = await User.findOne({ walletAddress: ord.AdminWallet });
    const Contract = new web3.eth.Contract(PropertyABI, ord.uid);
    if (!Contract) return res.status(404).send("Contract not found...");
    const address = await Contract?.methods.EscrowContractAddress().call({ from: ord.AdminWallet });;
    if (!address) return res.status(404).send("address not found...");
    const EscrowContract = new web3.eth.Contract(EscrowABI, address);
    const gasPrice = await web3.eth.getGasPrice();
    if (!EscrowContract) return res.status(404).send("Escrow Contract not found...");
    const buy = await EscrowContract?.methods.BuyPropertyToken(
      req.body.buyer,
      req.body.currency,
      req.body.tokens,
      req.body.Receivabletokens,
      req.body.Receivablefee,
    );
    const encodedABI = buy.encodeABI();
    console.log('encodedABI:', encodedABI);
    console.log('address:', address);
    web3.eth.estimateGas({
      from: ord.AdminWallet,
      to: address,
      data: encodedABI
    })
      .then(gasEstimate => {
        const transactionAdmin = {
          from: ord.AdminWallet, // Replace with your Ethereum address
          to: address, // Replace with your smart contract address
          gas: gasEstimate, // Set an appropriate gas limit
          data: encodedABI // Include the encoded ABI data here
        };
        web3.eth.accounts.signTransaction(transactionAdmin, fromUser.privateKey)
          .then(signedTx => {
            return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
          }).then(async (receipt) => {
            console.log('Transaction receipt:', receipt);
            const Gas = gasEstimate*gasPrice/1e18;
            const updatedord = await Product.findByIdAndUpdate(
              req.params.id,
              // { $push: { ...req.body} },
              { $push: { 'tokenHolder': {
                'buyer': req.body.buyer,
                'TypeOfCurrency': req.body.currency,
                'TokensOrder': req.body.tokens,
                'PayableTokens': req.body.Receivabletokens,
                'PayableFee':req.body.Receivablefee,
                "Total Used Gas": Gas,
                "transactionHash":receipt.transactionHash,
              }} },
              // req.body,
              // {
              //   $set: {
              //     ...req.body.tokenHolder,
              //     // ...req.body.product,
              //     // image: uploadedResponse,
              //   }
              // },
              {
                new: true,
              }
            );
            res.send(updatedord);
          })
      })
   
  } catch (error) {
    res.status(500).send("Error on trasect: " + error.message);
    console.log(error.message);
  }
})

// EDIT PRODUCT

router.put("/:id", isAdmin, async (req, res) => {
  if (req.body.productImg) {
    const destroyResponse = await cloudinary.uploader.destroy(
      req.body.product.image.public_id
    );

    if (destroyResponse) {
      const uploadedResponse = await cloudinary.uploader.upload(
        req.body.productImg,
        {
          upload_preset: "almonivepk",
        }
      );

      if (uploadedResponse) {
        const updatedProduct = await Product.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              ...req.body.product,
              image: uploadedResponse,
            },
          },
          { new: true }
        );

        res.status(200).send(updatedProduct);
      }
    }
  } else {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body.product,
        },
        { new: true }
      );
      res.status(200).send(updatedProduct);
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

//GET ALL PRODUCTS

router.get("/", async (req, res) => {
  const qlocation = req.query.location;
  try {
    let products;

    if (qlocation) {
      products = await Product.find({
        location: qlocation,
      }).sort({ _id: -1 });
    } else {
      products = await Product.find().sort({ _id: -1 });
    }

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

//GET Property Details from mongoDB
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});


// fetch the property details from Blcokchain
router.get("/fetch/:id", async (req, res) => {
  try {
    const ord = await Product.findById(req.params.id);
    if (!ord) return res.status(404).send("Not found...");
    const PropContract = new web3.eth.Contract(
      PropertyABI, ord.uid);
      if (!PropContract) return res.status(404).send("Contracts not found...");
      let PropertyDetails = await PropContract?.methods.
      getCompletePropDetails().call({ 
        from: walletAddresss });
    res.status(200).send(PropertyDetails);
  } catch (error) {
    res.status(500).send(error);
  }
});


  
router.get("/price/:id", async (req, res) => {
  try {
    const ord = await Product.findById(req.params.id);
    if (!ord) return res.status(404).send("Not found...");
    const Contract = new web3.eth.Contract(PropertyABI, ord.uid);
    if (!Contract) return res.status(404).send("Contract not found...");
    let PropertyDetails = await Contract?.methods.TokenPrice().call({ 
      from: walletAddresss });
    res.status(200).send(PropertyDetails);
  } catch (error) {
    res.status(500).send(error); 
  }
});

router.get("/usdt/:id", async (req, res) => {
  try {
    const ord = await Product.findById(req.params.id);
    if (!ord) return res.status(404).send("Not found...");
    const Contract = new web3.eth.Contract(
      aggregatorV3InterfaceABI, 
      USDTaddr
      );
    if (!Contract) return res.status(404).send("Contract not found...");
    let PropertyDetails = await Contract?.methods.latestRoundData().call({ 
      from: ord.AdminWallet });
    res.status(200).send(PropertyDetails.answer);
  } catch (error) {
    res.status(500).send(error); 
  }
});

router.get("/usdc/:id", async (req, res) => {
  try {
    const ord = await Product.findById(req.params.id);
    if (!ord) return res.status(404).send("Not found...");
    const Contract = new web3.eth.Contract(
      aggregatorV3InterfaceABI, 
      USDCaddr
      );
    if (!Contract) return res.status(404).send("Contract not found...");
    let PropertyDetails = await Contract?.methods.latestRoundData().call({ 
      from: ord.AdminWallet });
    res.status(200).send(PropertyDetails.answer);
  } catch (error) {
    res.status(500).send(error); 
  }
});

module.exports = router;
