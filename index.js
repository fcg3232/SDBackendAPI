const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// const logger = require("morgan");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const register = require("./routes/register");
const login = require("./routes/login");
const orders = require("./routes/orders");
const stripe = require("./routes/stripe");
const users = require("./routes/users");
const productsRoute = require("./routes/products");
// const { Property } = require("./models/personal");
const personaldb = require("./routes/personaldb");
const propertydb = require("./routes/propertiesdb");
const propllc = require("./routes/propLLC");
const propinfo = require("./routes/propertyInfo");
const blogRoute = require("./routes/blogdb");
const categoryRoute = require("./routes/categorydb");
const berbixRouts = require("./routes/berbix");
const emailRouts = require("./routes/sendemail");
const ChangePasswordRouts = require("./routes/changePassword");
const TermsofCondition = require("./routes/TermsofCondition");
const buyerOrder = require("./routes/buyerOrder");
const sellerOrder = require("./routes/sellerOrder");
const orderMatching = require("./routes/orderMatching");
// const Web3 = require("web3");
// const { auth, isUser, isAdmin } = require("./middleware/auth");
// const { User } = require("./models/user");
// const Infura_url = process.env.Infura;
// const web3 = new Web3(Infura_url);

// const findAddress = async(req, res) => {
// 	const AdminWallet =   await User.findById({_id:"656846a19f1f9aedaabadcb4"});
// // const AdminWallet =   await User.findById("656846a19f1f9aedaabadcb4");
//   console.log('Users with only username:', AdminWallet.walletAddress);
// }
// findAddress()
// const FetchProperties = async () => {
// 	const realEstateContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
// 	//   let appoint = await realEstateContract?.methods.revokePropertyAdminRole("0x6FA348FF080e701aFbe8DbbE959576212B4213d0");

// 	// const encoded = appoint.encodeABI();
// 	//   const transactionAdmin = {
// 	//     from: '0x59e339b5220c7c31b6129213EBe177bd15E7c2fA', // Replace with your Ethereum address
// 	//     to: CONTRACT_ADDRESS, // Replace with your smart contract address
// 	//     gas: 2000000, // Set an appropriate gas limit
// 	//     data: encoded // Include the encoded ABI data here
// 	//   };
// 	//   web3.eth.accounts.signTransaction(transactionAdmin, 'f1ad5e8bb283696d75e682fb780419803c99c518b5bd66d422bb6ef304a91414')
// 	//   .then(signedTx => {
// 	//     return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
// 	//   })
// 	//     .then(receipt => {
// 	//     console.log('Transaction receipt:', receipt);
// 	//   })
// 	//   .catch(error => {
// 	//     console.error('Transaction error:', error);
// 	//   });
// 	//   web3.eth.estimateGas({
// 	//     from: '0x6FA348FF080e701aFbe8DbbE959576212B4213d0',
// 	//     to: CONTRACT_ADDRESS,
// 	//     data: encoded
// 	//   })
// 	//     .then(gasEstimate => {
// 	//       console.log('Gas estimate:', gasEstimate);
// 	//       const transactionAdmin = {
// 	//         from: '0x59e339b5220c7c31b6129213EBe177bd15E7c2fA', // Replace with your Ethereum address
// 	//         to: CONTRACT_ADDRESS, // Replace with your smart contract address
// 	//         gas: gasEstimate, // Set an appropriate gas limit
// 	//         data: encoded // Include the encoded ABI data here
// 	//       };
// 	//       web3.eth.accounts.signTransaction(transactionAdmin, 'f1ad5e8bb283696d75e682fb780419803c99c518b5bd66d422bb6ef304a91414')
// 	//       .then(signedTx => {
// 	//         return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
// 	//       })
// 	//         .then(receipt => {
// 	//         console.log('Transaction receipt:', receipt);
// 	//       })
// 	//       .catch(error => {
// 	//         console.error('Transaction error:', error);
// 	//       });
// 	//     })
// 	//     .catch(error => {
// 	//       console.error('Error estimating gas:', error);
// 	//     });

// 	// let appoint = await realEstateContract?.methods.GrantPropOwnerRole("0x7BB0c04682Bc957827fdF14a7Cc07A9C350C7C08");
// 	// const encoded = appoint.encodeABI();
// 	// const transactionAdmin = {
// 	// 	from: '0x59e339b5220c7c31b6129213EBe177bd15E7c2fA', // Replace with your Ethereum address
// 	// 	to: CONTRACT_ADDRESS, // Replace with your smart contract address
// 	// 	gas: 2000000, // Set an appropriate gas limit
// 	// 	data: encoded // Include the encoded ABI data here
// 	// };
// 	// web3.eth.accounts.signTransaction(transactionAdmin, 'f1ad5e8bb283696d75e682fb780419803c99c518b5bd66d422bb6ef304a91414')
// 	// 	.then(signedTx => {
// 	// 		return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
// 	// 	})
// 	// 	.then(receipt => {
// 	// 		console.log('Transaction receipt:', receipt);
// 	// 	})
// 	// 	.catch(error => {
// 	// 		console.error('Transaction error:', error);
// 	// 	});

// 	// web3.eth.estimateGas({
// 	// 	from: '0x6FA348FF080e701aFbe8DbbE959576212B4213d0',
// 	// 	to: CONTRACT_ADDRESS,
// 	// 	data: encoded
// 	// })
// 	// 	.then(gasEstimate => {
// 	// 		console.log('Gas estimate:', gasEstimate);
// 	// 		const transactionAdmin = {
// 	// 			from: '0x59e339b5220c7c31b6129213EBe177bd15E7c2fA', // Replace with your Ethereum address
// 	// 			to: CONTRACT_ADDRESS, // Replace with your smart contract address
// 	// 			gas: gasEstimate, // Set an appropriate gas limit
// 	// 			data: encoded // Include the encoded ABI data here
// 	// 		};
// 	// 		web3.eth.accounts.signTransaction(transactionAdmin, 'f1ad5e8bb283696d75e682fb780419803c99c518b5bd66d422bb6ef304a91414')
// 	// 			.then(signedTx => {
// 	// 				return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
// 	// 			})
// 	// 			.then(receipt => {
// 	// 				console.log('Transaction receipt:', receipt);
// 	// 			})
// 	// 			.catch(error => {
// 	// 				console.error('Transaction error:', error);
// 	// 			});
// 	// 	})
// 	// 	.catch(error => {
// 	// 		console.error('Error estimating gas:', error);
// 	// 	});

// 	  let Propertytoken = await realEstateContract?.methods.CreateProperty('0x11fEF3F29B81491c79e433EFE2e533401Bf3cC71');
// 	  const encodedABI = Propertytoken.encodeABI();
// 	  web3.eth.estimateGas({
// 	    from: '0x7BB0c04682Bc957827fdF14a7Cc07A9C350C7C08',
// 	    to: CONTRACT_ADDRESS,
// 	    data: encodedABI
// 	  })
// 	    .then(gasEstimate => {
// 	      console.log('Gas estimate:', gasEstimate);
// 	      const transactionAdmin = {
// 	        from: '0x7BB0c04682Bc957827fdF14a7Cc07A9C350C7C08', // Replace with your Ethereum address
// 	        to: CONTRACT_ADDRESS, // Replace with your smart contract address
// 	        gas: gasEstimate, // Set an appropriate gas limit
// 	        data: encodedABI // Include the encoded ABI data here
// 	      };
// 	      web3.eth.accounts.signTransaction(transactionAdmin, '0xed8f0f72198f2a80d6b2e9e9e175d1a528a08509f414db409d0eaea1bfb3bf61')
// 	      .then(signedTx => {
// 	        return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
// 	      })
// 	        .then(async (receipt) => {
// 	        console.log('Transaction receipt:', receipt);
// 	        let PropertyAdd = await realEstateContract?.methods.PropertyAddress().call({ from: '0x7BB0c04682Bc957827fdF14a7Cc07A9C350C7C08' });
// 	        console.error('Property Address:', PropertyAdd);
// 	      })
// 	      .catch(error => {
// 	        console.error('Transaction error:', error);
// 	      });
// 	    })
// 	    .catch(error => {
// 	      console.error('Error estimating gas:', error);
// 	    });
// };
// FetchProperties();

// const createAccount = async () => {

// 	web3.eth.getBalance('0x7BB0c04682Bc957827fdF14a7Cc07A9C350C7C08')
// 		.then((accountBalance) => {
// 			console.log("Balance of Address", accountBalance)
// 		});
// };
// createAccount()
// console.log("create Address", createAccount())
const app = express();
require("dotenv").config();
// app.use(express.json());

app.use(bodyParser.json({ limit: "50000mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50000mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(cors());
app.use(
  express.json({ extended: true, parameterLimit: 1000000000, limit: "50000mb" })
);

//.........................file upload using multer...................................//

app.use("/imges", express.static(path.join(__dirname, "/imges")));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "imges");
  },

  filename: (req, file, cb) => {
    // let ext = path.extname(file.originalname)
    // cb(null, Date.now() + '-' + ext)
    // cb(null,ext)
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
  // file.mv(`${__dirname}/imges/${file.name}`)
});

//.........................end...................................//

app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/orders", orders);
app.use("/api/stripe", stripe);
app.use("/api/products", productsRoute);
app.use("/api/users", users);
app.use("/api/personaldb", personaldb);
app.use("/api/propertiesdb", propertydb);
app.use("/api/propLLC", propllc);
app.use("/api/propertyInfo", propinfo);
app.use("/api/blogdb", blogRoute);
app.use("/api/categorydb", categoryRoute);
app.use("/api/berbix", berbixRouts);
app.use("/api/sendemail", emailRouts);
app.use("/api/ChangePassword", ChangePasswordRouts);
app.use("/api/TermsofCondition", TermsofCondition);
app.use("/api/buyerOrder", buyerOrder);
app.use("/api/sellerOrder", sellerOrder);
app.use("/api/orderMatching", orderMatching);

// app.get("/", (req, res) => {
//   res.send("Welcome our to online shop API...");
// });

// console.log(Property);
// app.get("/orderMatching", (req, res) => {
//   res.send(orderMatching);
// });
// app.get("/buyerOrder", (req, res) => {
//   res.send(buyerOrder);
// });
// app.get("/sellerOrder", (req, res) => {
//   res.send(sellerOrder);
// });

// app.get("/TermsofCondition", (req, res) => {
//   res.send(TermsofCondition);
// });

// app.get("/sendemail", (req, res) => {
//   res.send("sending mail");
// });
// app.get("/register", (req, res) => {
//   res.send("sending mail");
// });

// app.get("/products", (req, res) => {
//   res.send(products);
// });

// app.get("/personaldb", (req, res) => {
//   res.send(personaldb);
// });

// app.get("/personaldb", (req, res) => {
//   res.send(personaldb);
// });

// app.get("/berbix", (req, res) => {
//   res.send(berbix);
// });

// app.get("/propLLC", (req, res) => {
//   res.send(propLLC);
// });

// app.get("/propertyInfo", (req, res) => {
//   res.send(propertyInfo);
// });
// app.get("/blogdb", (req, res) => {
//   res.send(blogdb);
// });

// app.get("/users", (req, res) => {
//   res.send(users);
// });

const url = process.env.DB_URI;
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port: ${port}...`);
});

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established..."))
  .catch((error) => console.error("MongoDB connection failed:", error.message));
