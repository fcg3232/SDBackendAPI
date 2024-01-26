const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const moment = require("moment");

const router = require("express").Router();

//GET ALL USERS

router.get("/", isAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ _id: -1 });
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

//DELETE

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    res.status(200).send(deletedUser);
  } catch (error) {
    res.status(500).send(error);
  }
});
// walletAddress: { type: String, required: true},
// privateKey:

// GET USER
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).send({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      walletAddress: user.walletAddress,
      privateKey: user.privateKey,
      isAdmin: user.isAdmin,
      isAccept: user.isAccept,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});



router.put("/isaccept/:id", isUser, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        isAccept: req.body.isAccept,
      },
      { new: true }
    );

    res.status(200).send({
      isAccept: updatedUser.isAccept,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// UPDATE USER
router.put("/:id", isUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!(user.email === req.body.email)) {
      const emailInUse = await User.findOne({ email: req.body.email });
      if (emailInUse)
        return res.status(400).send("That email is already taken...");
    }

    if (req.body.password && user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      user.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        isAdmin: req.body.isAdmin,
        isAccept: req.body.isAccept,
        password: user.password,
      },
      { new: true }
    );

    res.status(200).send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isAccept: updatedUser.isAccept,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET USER STATS

router.get("/stats", isAdmin, async (req, res) => {
  const previousMonth = moment()
    .month(moment().month() - 2)
    .format("YYYY-MM-DD HH:mm:ss");

  try {
    const users = await User.aggregate([
      { $match: { createdAt: { $gte: new Date(previousMonth) } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
