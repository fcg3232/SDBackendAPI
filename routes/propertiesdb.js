const { Propertydb } = require("../models/propertydb");
const winston = require("winston");
const Joi = require("joi");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const router = require("express").Router();


// if (Web3.givenProvider && Web3.givenProvider.chainId === Web3.utils.toHex(421614)) {
// }
router.get("/", async (req, res, next) => {
  try {
    const propdb = await Propertydb.find().sort({ date: -1 });
    // const filteredprop = prop.filter(pro => pro.uid === req.user._id);
    // res.send(filteredprop);
    res.send(propdb);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
    winston.error(error.message);
  }
});



router.post("/", async (req, res) => {
  const schema = Joi.object({
    buildingtype: Joi.string().min(3).max(10240).required(),
    propstatus: Joi.string().min(3).max(10240).required(),
    rent: Joi.number().integer().min(3).max(102400000).required(),
    propaddress: Joi.string().min(3).max(10240).required(),
    active: Joi.boolean(),
    date: Joi.date().default(false),
    author: Joi.string().min(3),
    uid: Joi.string(),
  });

  const { error } = schema.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const {buildingtype, propstatus, rent, propaddress, active, date, author, uid } = req.body;

  let propt = new Propertydb({buildingtype, propstatus, rent, propaddress, active, date, author, uid });
  try {
    propt = await propt.save();
    res.send(propt);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
    console.log(error.message);
  }
});


router.put("/:id", async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().min(3).max(200).required().email(),
    phone: Joi.string().min(3).max(200).required(),
    card: Joi.string().min(3).max(200).required(),
    address: Joi.string().min(3).max(10240).required(),
    buildingtype: Joi.string().min(3).max(10240),
    propstatus: Joi.string().min(3).max(10240),
    rent: Joi.number().integer().min(3).max(10240),
    propaddress: Joi.string().min(3).max(10240),
    active: Joi.boolean(),
    date: Joi.date(),
    author: Joi.string().min(3),
    uid: Joi.string(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(result.error.details[0].message);
  try {
    const prop = await Propertydb.findById(req.params.id);
    if (!prop) return res.status(404).send("Propertydb not found...");
    // if (prop.uid !== req.user._id)
    // return res.status(401).send("Property update failed. Not authorized...");
    const {buildingtype, propstatus, rent, propaddress, active, date, author, uid } = req.body;
    const updatedprop = await Propertydb.findByIdAndUpdate(
      req.params.id,
      {buildingtype, propstatus, rent, propaddress, active, date, author, uid },
      { new: true }
    );
    res.send(updatedprop);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
    console.log(error.message);
  }
});



router.patch("/:id", async (req, res) => {
  try {
    const prop = await Propertydb.findById(req.params.id);
    if (!prop) return res.status(404).send("Propertydb not found...");
    // if (prop.uid !== req.user._id)
    // return res.status(401).send("Propertydb check/uncheck failed. Not authorized...");
    const updatedprop = await Propertydb.findByIdAndUpdate(
      req.params.id,
      {
        active: !prop.active,
      },
      {
        new: true,
      }
    );
    res.send(updatedprop);

  } catch (error) {
    res.status(500).send("Error: " + error.message);
    console.log(error.message);
  }

});



router.delete("/:id", async (req, res) => {
  try {
    const prop = await Propertydb.findById(req.params.id);
    if (!prop) return res.status(404).send("Propertydb not found...");
    // if (prop.uid !== req.user._id)
    // return res.status(401).send("Propertydb deletion failed. Not authorized...");
    const deletedprop = await Propertydb.findByIdAndDelete(req.params.id);
    res.send(deletedprop);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
    console.log(error.message);
  }

});

module.exports = router;

