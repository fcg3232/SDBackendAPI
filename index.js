const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const logger = require('morgan')
const path = require('path');
const multer = require('multer');
const mongoose = require("mongoose");
const register = require("./routes/register");
const login = require("./routes/login");
const orders = require("./routes/orders");
const stripe = require("./routes/stripe");
const users = require("./routes/users");
const productsRoute = require("./routes/products");
const { Property } = require("./models/personal");
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

const app = express();
require("dotenv").config();
// app.use(express.json());



app.use(bodyParser.json({ limit: '50000mb' }));
app.use(bodyParser.urlencoded({ limit: '50000mb', extended: true, parameterLimit: 50000 }));

app.use(cors());
app.use(express.json({ extended: true, parameterLimit: 1000000000, limit: "50000mb" }));


app.use(express.static(path.join(__dirname, "./frontend/dist")));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "./frontend/dist/index.html"));
});




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


app.get("/products", (req, res) => {
	res.send(products);
});

app.get("/personaldb", (req, res) => {
	res.send(personaldb);
});

app.get("/personaldb", (req, res) => {
	res.send(personaldb);
});

app.get("/berbix", (req, res) => {
	res.send(berbix);
});

app.get("/propLLC", (req, res) => {
	res.send(propLLC);
});

app.get("/propertyInfo", (req, res) => {
	res.send(propertyInfo);
});
app.get("/blogdb", (req, res) => {
	res.send(blogdb);
});

app.get("/users", (req, res) => {
	res.send(users);
});

const url = process.env.DB_URI;
const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`Server running on port: ${port}...`);
});


mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
	.then(() => console.log("MongoDB connection established..."))
	.catch((error) => console.error("MongoDB connection failed:", error.message));

