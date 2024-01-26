const { Personal } = require("../models/personal");
const winston = require("winston");
const Joi = require("joi");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const router = require("express").Router();



router.get("/", async (req, res, next) => {
  try {
    const prop = await Personal.find().sort({ date: -1 });
    // const filteredprop = prop.filter(pro => pro.uid === req.user._id);
    // res.send(filteredprop);
    res.send(prop);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
    winston.error(error.message);
  }
});



router.post("/", async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().min(3).max(200).required().email(),
    phone: Joi.string().min(3).max(200).required(),
    card: Joi.string().min(3).max(200).required(),
    address: Joi.string().min(3).max(10240).required(),
    date: Joi.date(),
    author: Joi.string().min(3),
    uid: Joi.string(),
  });

  const { error } = schema.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const { name, email, phone, card, address, buildingtype, propstatus, rent, propaddress, active, date, author, uid } = req.body;

  let propt = new Personal({ name, email, phone, card, address, buildingtype, propstatus, rent, propaddress, active, date, author, uid });
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
    date: Joi.date(),
    author: Joi.string().min(3),
    uid: Joi.string(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(result.error.details[0].message);
  try {
    const prop = await Personal.findById(req.params.id);
    if (!prop) return res.status(404).send("Personal not found...");
    // if (prop.uid !== req.user._id)
    // return res.status(401).send("Personal update failed. Not authorized...");
    const { name, email, phone, card, address, buildingtype, propstatus, rent, propaddress, active, date, author, uid } = req.body;
    const updatedprop = await Personal.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, card, address, buildingtype, propstatus, rent, propaddress, active, date, author, uid },
      { new: true }
    );
    res.send(updatedprop);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
    console.log(error.message);
  }
});



// router.patch("/:id", async (req, res) => {
//   try {
//     const prop = await Personal.findById(req.params.id);
//     if (!prop) return res.status(404).send("Personal not found...");
//     // if (prop.uid !== req.user._id)
//     // return res.status(401).send("Personal check/uncheck failed. Not authorized...");
//     const updatedprop = await Personal.findByIdAndUpdate(
//       req.params.id,
//       {
//         active: !prop.active,
//       },
//       {
//         new: true,
//       }
//     );
//     res.send(updatedprop);

//   } catch (error) {
//     res.status(500).send("Error: " + error.message);
//     console.log(error.message);
//   }

// });



router.delete("/:id", async (req, res) => {
  try {
    const prop = await Personal.findById(req.params.id);
    if (!prop) return res.status(404).send("Personal not found...");
    // if (prop.uid !== req.user._id)
    // return res.status(401).send("Personal deletion failed. Not authorized...");
    const deletedprop = await Personal.findByIdAndDelete(req.params.id);
    res.send(deletedprop);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
    console.log(error.message);
  }

});

module.exports = router;

