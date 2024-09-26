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
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      email: user.email,
      dateofBirth: user.dateofBirth,
      residence_country: user.residence_country,
      nationality: user.nationality,
      walletAddress: user.walletAddress,
      privateKey: user.privateKey,
      applicant_id: user.applicant_id,
      verification_id: user.verification_id,
      isAdmin: user.isAdmin,
      isAccept: user.isAccept,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// PATCH UPDATE USER
router.patch("/:id", isUser, async (req, res) => {
  try {
    const { verification_id } = req.body;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      verification_id,
    });

    res.status(200).send({
      ...updatedUser._doc,
      verification_id,
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
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        email: req.body.email,
        dateofBirth: req.body.dateofBirth,
        residence_country: req.body.residence_country,
        nationality: req.body.nationality,
        isAdmin: req.body.isAdmin,
        isAccept: req.body.isAccept,
        password: user.password,
      },
      { new: true }
    );

    res.status(200).send({
      _id: updatedUser._id,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      email: updatedUser.email,
      dateofBirth: updatedUser.dateofBirth,
      residence_country: updatedUser.residence_country,
      nationality: updatedUser.nationality,
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
