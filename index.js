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
const Expenses = require("./routes/Expenses");
const Rentdb = require("./routes/Rent");
const personaldb = require("./routes/personaldb");
const propertydb = require("./routes/propertiesdb");
const propllc = require("./routes/propLLC");
const propinfo = require("./routes/propertyInfo");
const blogRoute = require("./routes/blogdb");
const categoryRoute = require("./routes/categorydb");
const kycRouts = require("./routes/kyc");
const emailRouts = require("./routes/sendemail");
const ChangePasswordRouts = require("./routes/ChangePassword");
const TermsofCondition = require("./routes/TermsofCondition");
const buyerOrder = require("./routes/buyerOrder");
const sellerOrder = require("./routes/sellerOrder");
const orderMatching = require("./routes/orderMatching");
const { Product } = require("./models/product");
const { Expense } = require("./models/expense");
const { Rent } = require("./models/rent");
const PropertyABI = require("./contract/Property.json");
const EscrowABI = require("./contract/Escrow.json");
const Web3 = require("web3");
const Infura_url = process.env.Infura;
const web3 = new Web3(Infura_url);
const cron = require("node-cron");
const { deflateRaw } = require("zlib");
const { json } = require("body-parser");
const app = express();
require("dotenv").config();
const ObjectId = mongoose.Types.ObjectId;
// const corsOptions = {
//   origin: 'https://www.app.secondarydao.com', // Only allow this origin
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Allowed headers
//   credentials: true, // If using cookies or authorization headers
// };
// app.use(cors(corsOptions));
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

// app.use(cors());
// // app.use((req, res, next) => {
// //   res.header({"Access-Control-Allow-Origin": "*"});
// //   next();
// // })

// app.use(
//   express.json({ extended: true, parameterLimit: 1000000000, limit: "50000mb" })
// );
// app.use(bodyParser.json({ limit: "50000mb" }));
// app.use(
//   bodyParser.urlencoded({
//     limit: "50000mb",
//     extended: true,
//     parameterLimit: 50000,
//   })
// );

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With, content-type, authorization"
//   );
//   next();
// });

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.options('*', cors(corsOptions)); // Handle preflight requests

// app.use((req, res, next) => {
//   res.on('finish', () => {
//     console.log('Access-Control-Allow-Origin:', res.get('Access-Control-Allow-Origin'));
//   });
//   next();
// });

// app.use(express.json());
// app.use(bodyParser.raw({ type: "application/json" }));

const calculateAnnualCoC = async () => {
  const products = await Product.find();
  for (let i = 0; i < products.length; i++) {
    const rentalIncome = await Rent.find({ propertyId: products[i]._id });
    // const det = [];
    if (rentalIncome.length > 0) {
      for (let j = 0; j < rentalIncome.length; j++) {
        // det.push(rentalIncome)

        const Expenses = await Expense.find({
          propertyId: products[i]._id,
          year: rentalIncome[j].year,
        });
        // console.log(Expenses[0].totalExpense)
        // console.log(Expenses)
        if (Expenses) {
          const cal =
            ((rentalIncome[j].annualRentalIncome - Expenses[0].totalExpense) /
              (products[i].purchasePrice / 1e8 +
                products[i].listingfee / 1e8 +
                products[i].InitialReserves / 1e8)) *
            100;

          await Rent.findByIdAndUpdate(rentalIncome[j]._id, {
            annualCoC: cal,
          });
        }
      }
    }
  }
};
calculateAnnualCoC();
const calculateRentalYeild = async () => {
  const products = await Product.find();
  for (let i = 0; i < products.length; i++) {
    const rentalIncome = await Rent.find({ propertyId: products[i]._id });
    // const det = [];
    if (rentalIncome.length > 0) {
      for (let j = 0; j < rentalIncome.length; j++) {
        // det.push(rentalIncome)

        const Expenses = await Expense.find({
          propertyId: products[i]._id,
          year: rentalIncome[j].year,
        });
        // console.log(Expenses[0].totalExpense)
        // console.log(Expenses)
        if (Expenses) {
          const cal =
            ((rentalIncome[j].annualRentalIncome - Expenses[0].totalExpense) /
              (products[i].purchasePrice / 1e8)) *
            100;

          await Rent.findByIdAndUpdate(rentalIncome[j]._id, {
            rentalYield: cal,
          });
        }
      }
    }
  }
};

// run after every 2 hours
const cornupdateRentalYeild = async () => {
  cron.schedule("0  */2 * * *", async () => {
    await calculateRentalYeild();
  });
};
cornupdateRentalYeild();

const calculateAnnualRent = async () => {
  const products = await Product.find();

  for (let i = 0; i < products.length; i++) {
    const rentalIncome = await Rent.find({ propertyId: products[i]._id });

    if (rentalIncome.length > 0) {
      for (let j = 0; j < rentalIncome.length; j++) {
        const result = await Rent.aggregate([
          {
            $match: {
              propertyId: ObjectId(rentalIncome[j].propertyId),
              year: rentalIncome[j].year,
            },
          },
          {
            $unwind: "$rent", // Deconstruct the rent array into individual documents
          },
          {
            $group: {
              _id: null, // No specific grouping key needed
              annualRentalIncome: { $sum: "$rent.amount" }, // Sum the amount fields
            },
          },
        ]);
        await Rent.findByIdAndUpdate(rentalIncome[j]._id, {
          annualRentalIncome: result[0].annualRentalIncome,
        });
      }
    }
  }
};
// run after every 2 hours
const cornupdateAnnualRent = async () => {
  cron.schedule("0  */2 * * *", async () => {
    await calculateAnnualRent();
  });
};
cornupdateAnnualRent();

const calculateTotalExpense = async () => {
  const products = await Product.find();
  for (let i = 0; i < products.length; i++) {
    const Expenses = await Expense.find({ propertyId: products[i]._id });
    console.log(Expenses.length);
    for (let j = 0; j < Expenses.length; j++) {
      if (Expenses.length > 0) {
        const result = await Expense.aggregate([
          {
            $match: {
              propertyId: ObjectId(Expenses[j].propertyId),
              year: Expenses[j].year,
            },
          },
          {
            $unwind: "$expenses", // Deconstruct the expenses array into individual documents
          },
          {
            $group: {
              _id: null, // No specific grouping key needed
              totalExpense: { $sum: "$expenses.amount" }, // Sum the amount fields
            },
          },
        ]);
        await Expense.findByIdAndUpdate(Expenses[j]._id, {
          totalExpense: result[0].totalExpense,
        });
      }
    }
  }
};

// run after every 2 hours
const cornupdateExpense = async () => {
  cron.schedule("0  */2 * * *", async () => {
    await calculateTotalExpense();
  });
};
cornupdateExpense();

const fetchPropertyDetails = async () => {
  try {
    const products = await Product.find();
    for (let i = 0; i < products.length; i++) {
      const Contract = new web3.eth.Contract(PropertyABI, products[i].uid);
      const det = await Contract?.methods
        .getCompletePropDetails()
        .call({ from: products[i].AdminWallet });
      await Product.findByIdAndUpdate(products[i]._id, {
        listingfee: det.PropertyDetails.ListingFee,
        InitialReserves: det.PropertyDetails.InitialManagementReserves,
        purchasePrice: det.PropertyDetails.PurchasePrice,
      });
    }
    // }
  } catch (error) {
    console.log(error.message);
  }
};

const cornupdatePropertyDetails = async () => {
  cron.schedule("0 0 * * *", async () => {
    await fetchPropertyDetails();
  });
};
cornupdatePropertyDetails();

const fetchTokenBalance = async () => {
  try {
    const products = await Product.find();
    for (let i = 0; i < products.length; i++) {
      const Contract = new web3.eth.Contract(PropertyABI, products[i].uid);
      const address = await Contract?.methods
        .EscrowContractAddress()
        .call({ from: products[i].AdminWallet });
      if (address != 0x0000000000000000000000000000000000000000) {
        const EscrowContract = new web3.eth.Contract(EscrowABI, address);
        const check = await EscrowContract?.methods
          .Balance()
          .call({ from: products[i].AdminWallet });
        await Product.findByIdAndUpdate(products[i]._id, {
          tokenBlance: check,
        });
      } else {
        await Product.findByIdAndUpdate(products[i]._id, {
          tokenBlance: 0,
        });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

const cornupdateTokenBalance = async () => {
  cron.schedule("0  */2 * * *", async () => {
    await fetchTokenBalance();
  });
};
cornupdateTokenBalance();

const fetchTotalSupply = async () => {
  try {
    const products = await Product.find();
    for (let i = 0; i < products.length; i++) {
      const Contract = new web3.eth.Contract(PropertyABI, products[i].uid);
      const address = await Contract?.methods
        .EscrowContractAddress()
        .call({ from: products[i].AdminWallet });
      if (address != 0x0000000000000000000000000000000000000000) {
        const EscrowContract = new web3.eth.Contract(EscrowABI, address);
        const check = await EscrowContract?.methods
          .TotalToken()
          .call({ from: products[i].AdminWallet });
        await Product.findByIdAndUpdate(products[i]._id, {
          totalSupply: check,
        });
      } else {
        await Product.findByIdAndUpdate(products[i]._id, {
          totalSupply: 0,
        });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

const cornupdateTotalSupply = async () => {
  cron.schedule("0  */2 * * *", async () => {
    await fetchTotalSupply();
  });
};
cornupdateTotalSupply();

// Update Token Price
const fetchTtokenPrice = async () => {
  try {
    const products = await Product.find();
    for (let i = 0; i < products.length; i++) {
      const Contract = new web3.eth.Contract(PropertyABI, products[i].uid);
      const check = await Contract?.methods
        .TokenPrice()
        .call({ from: products[i].AdminWallet });
      await Product.findByIdAndUpdate(products[i]._id, {
        tokenPrice: check,
      });
      // console.log("updatedord", updatedord)
    }
  } catch (error) {
    console.log(error.message);
  }
};

// '*/2 * * * *'
const cornupdateTokenPrice = async () => {
  cron.schedule("0  */2 * * *", async () => {
    await fetchTtokenPrice();
  });
};
cornupdateTokenPrice();

// update ReSelling
const updateReSelling = async () => {
  try {
    const products = await Product.find();
    for (let i = 0; i < products.length; i++) {
      const Contract = new web3.eth.Contract(PropertyABI, products[i].uid);
      const check = await Contract?.methods
        .isResell()
        .call({ from: products[i].AdminWallet });
      await Product.findByIdAndUpdate(products[i]._id, {
        isReStartSelling: check,
      });
      // console.log("updatedord", updatedord)
    }
  } catch (error) {
    console.log(error.message);
  }
};

const cornupdateReSelling = async () => {
  cron.schedule("0  */2 * * *", async () => {
    await updateReSelling();
  });
};
cornupdateReSelling();

// update Start Selling
const updateSelling = async () => {
  try {
    const products = await Product.find();
    for (let i = 0; i < products.length; i++) {
      const Contract = new web3.eth.Contract(PropertyABI, products[i].uid);
      const check = await Contract?.methods
        .isStartsell()
        .call({ from: products[i].AdminWallet });
      await Product.findByIdAndUpdate(products[i]._id, {
        isStartSelling: check,
      });
      // console.log("updatedord", updatedord)
    }
  } catch (error) {
    console.log(error.message);
  }
};

const cornUpdateSelling = async () => {
  cron.schedule("0 0 * * *", async () => {
    await updateSelling();
  });
};
cornUpdateSelling();

// app.use(
//   bodyParser.json({
//     verify: (req, res, buf) => {
//       req.rawBody = buf;
//     },
//   })
// );

// const allowedOrigins = ['https://www.app.secondarydao.com', 'https://www.admin.secondarydao.com','http://localhost:3000'];
// app.use(cors({
//   origin: function (origin, callback) {
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, origin);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// }));

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
app.use("/api/expense", Expenses);
app.use("/api/rent", Rentdb);

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

app.get("/", (req, res) => {
  res.send("Welcome to SecondaryDAO API!");
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
