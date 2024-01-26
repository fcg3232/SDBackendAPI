const {Terms} = require("../models/TermsofCondition");
const router = require("express").Router();
const { auth, isUser, isAdmin } = require("../middleware/auth");



router.get("/", async (req, res, next) => {
  try {
    const prop = await Terms.find().sort({ date: -1 });
    res.send(prop);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
    winston.error(error.message);
  }
});

router.post("/", async (req, res) => {
    try {
        const newPost = new Terms(req.body);
      const savedPost = await newPost.save();
      res.status(200).send(savedPost);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //UPDATE
router.put("/:id", isAdmin, async (req, res) => {
    try {
      const updatedTerms = await Terms.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).send(updatedTerms);
    } catch (err) {
      res.status(500).send(err);
    }
  });
  
  //DELETE
  router.delete("/:id", isAdmin, async (req, res) => {
    try {
      await Terms.findByIdAndDelete(req.params.id);
      res.status(200).send("Terms has been deleted...");
    } catch (err) {
      res.status(500).send(err);
    }
  });

module.exports = router;