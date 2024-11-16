const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const register = require("./routes/register");
const login = require("./routes/login");
const orders = require("./routes/orders");
const stripe = require("./routes/stripe");
const users = require("./routes/users");
const productsRoute = require("./routes/products");
const personaldb = require("./routes/personaldb");
const propertydb = require("./routes/propertiesdb");
const propllc = require("./routes/propLLC");
const propinfo = require("./routes/propertyInfo");
const blogRoute = require("./routes/blogdb");
const categoryRoute = require("./routes/categorydb");
const kycRouts = require("./routes/kyc");
const emailRouts = require("./routes/sendemail");
const ChangePasswordRouts = require("./routes/changePassword");
const TermsofCondition = require("./routes/TermsofCondition");
const buyerOrder = require("./routes/buyerOrder");
const sellerOrder = require("./routes/sellerOrder");
const orderMatching = require("./routes/orderMatching");
const { Product } = require("./models/product");
const PropertyABI = require("./contract/Property.json");
const EscrowABI = require("./contract/Escrow.json");
const Web3 = require('web3');
const Infura_url = process.env.Infura;
const web3 = new Web3(Infura_url);
const cron = require('node-cron');
const app = express();
require("dotenv").config();
// app.use(express.json());
// app.use(bodyParser.raw({ type: "application/json" }));


const fetchTokenBalance = async () => {
  try {
    const products = await Product.find();
    for (let i = 0; i < products.length; i++) {
      const Contract = new web3.eth.Contract(PropertyABI, products[i].uid);
      const address = await Contract?.methods.EscrowContractAddress().call({ from: products[i].AdminWallet });
      if (address != 0x0000000000000000000000000000000000000000) {
        const EscrowContract = new web3.eth.Contract(EscrowABI, address);
        const check = await EscrowContract?.methods.Balance().call({ from: products[i].AdminWallet });
        await Product.findByIdAndUpdate(
          products[i]._id,
          {
            tokenBlance: check,
          },
        )
      } else {
        await Product.findByIdAndUpdate(
          products[i]._id,
          {
            tokenBlance: 0,
          },
        )
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}


const cornupdateTokenBalance = async () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('update Token Balance');
    await fetchTokenBalance();
  })
}
cornupdateTokenBalance();

const fetchTotalSupply = async () => {
  try {
    const products = await Product.find();
    for (let i = 0; i < products.length; i++) {
      const Contract = new web3.eth.Contract(PropertyABI, products[i].uid);
      const address = await Contract?.methods.EscrowContractAddress().call({ from: products[i].AdminWallet });
      if (address != 0x0000000000000000000000000000000000000000) {
        const EscrowContract = new web3.eth.Contract(EscrowABI, address);
        const check = await EscrowContract?.methods.TotalToken().call({ from: products[i].AdminWallet });
        await Product.findByIdAndUpdate(
          products[i]._id,
          {
            totalSupply: check,
          },
        )
      } else {
        await Product.findByIdAndUpdate(
          products[i]._id,
          {
            totalSupply: 0,
          },
        )
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

const cornupdateTotalSupply = async () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('update Token Supply');
    await fetchTotalSupply();
  })
}
cornupdateTotalSupply();

// Update Token Price
const fetchTtokenPrice = async () => {
  try {
    const products = await Product.find();
    for (let i = 0; i < products.length; i++) {
      const Contract = new web3.eth.Contract(PropertyABI, products[i].uid);
      const check = await Contract?.methods.TokenPrice().call({ from: products[i].AdminWallet });
      await Product.findByIdAndUpdate(
        products[i]._id,
        {
          tokenPrice: check,
        },
      )
      // console.log("updatedord", updatedord)
    }
  } catch (error) {
    console.log(error.message);
  }
}


// '*/2 * * * *'
const cornupdateTokenPrice = async () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('update Token PRice');
    await fetchTtokenPrice();
  })
}
cornupdateTokenPrice();

// update ReSelling
const updateReSelling = async () => {
  try {
    const products = await Product.find();
    for (let i = 0; i < products.length; i++) {
      const Contract = new web3.eth.Contract(PropertyABI, products[i].uid);
      const check = await Contract?.methods.isResell().call({ from: products[i].AdminWallet });
      await Product.findByIdAndUpdate(
        products[i]._id,
        {
          isReStartSelling: check,
        },
      )
      // console.log("updatedord", updatedord)
    }
  } catch (error) {
    console.log(error.message);
  }
}

const cornupdateReSelling = async () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('update Re_Selling');
    await updateReSelling();
  })
}
cornupdateReSelling();


// update Start Selling
const updateSelling = async () => {
  try {
    const products = await Product.find();
    for (let i = 0; i < products.length; i++) {
      const Contract = new web3.eth.Contract(PropertyABI, products[i].uid);
      const check = await Contract?.methods.isStartsell().call({ from: products[i].AdminWallet });
      await Product.findByIdAndUpdate(
        products[i]._id,
        {
          isStartSelling: check,
        },
      )
      // console.log("updatedord", updatedord)
    }
  } catch (error) {
    console.log(error.message);
  }
}

const cornUpdateSelling = async () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Update Selling...');
    await updateSelling();
  })
}
cornUpdateSelling();

app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
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

app.use(bodyParser.json({ limit: "50000mb" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, content-type, authorization"
  );
  next();
});

// app.use(express.static(path.join(__dirname, "./frontend/dist")));

// app.get("/", (req, res) => {
// 	res.sendFile(path.join(__dirname, "./frontend/dist/index.html"));
// });

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
app.use("/api/kyc", kycRouts);
// app.use("/api/kyc", bodyParser.raw({ type: "application/json" }), kycRouts);

app.use("/api/sendemail", emailRouts);
app.use("/api/ChangePassword", ChangePasswordRouts);
app.use("/api/TermsofCondition", TermsofCondition);
app.use("/api/buyerOrder", buyerOrder);
app.use("/api/sellerOrder", sellerOrder);
app.use("/api/orderMatching", orderMatching);


app.get("/orderMatching", (req, res) => {
  res.send(orderMatching);
});
app.get("/buyerOrder", (req, res) => {
  res.send(buyerOrder);
});
app.get("/sellerOrder", (req, res) => {
  res.send(sellerOrder);
});

app.get("/TermsofCondition", (req, res) => {
  res.send(TermsofCondition);
});

app.get("/sendemail", (req, res) => {
  res.send("sending mail");
});
app.get("/register", (req, res) => {
  res.send("sending mail");
});

// app.get("/products", (req, res) => {
//   res.send(products);
// });

app.get("/personaldb", (req, res) => {
  res.send(personaldb);
});

app.get("/personaldb", (req, res) => {
  res.send(personaldb);
});


app.get("/users", (req, res) => {
  res.send(users);
});
mongoose.set("strictQuery", false);
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
