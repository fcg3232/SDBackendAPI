const { Rent } = require("../models/rent");
const { auth, isUser, isAdmin } = require("../middleware/auth")
const router = require("express").Router();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
// Create a new Expense
router.post('/', async (req, res) => {
  try {
    const rent = new Rent(req.body);
    const savedRent = await rent.save();
    res.status(201).json(savedRent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all Expenses
router.get('/', async (req, res) => {
  try {
    const RentDat = await Rent.find().populate('propertyId');
    res.status(200).send(RentDat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single rent by ID
router.get('/:id', async (req, res) => {
  try {
    const rentdat = await Rent.findById(req.params.id).populate('propertyId');
    if (!rentdat) return res.status(404).json({ error: 'Rent not found' });
    res.status(200).json(rentdat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single rent by ID and year
router.get('/fetchData/:id', async (req, res) => {
  try {
    const rentdat = await Rent.findOne({ propertyId: req.params.id, year: req.body.year });
    console.log(req.body.year)
    // const rentdat = await Rent.findById(req.params.id);
    if (!rentdat) return res.status(404).json({ error: 'Rent not found' });
    res.status(200).json(rentdat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Update an Rent
router.put('/:id', async (req, res) => {
  try {
    const updatedRent = await Rent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRent) return res.status(404).json({ error: 'Rent not found' });
    // await updatedRent.save();
    // res.status(200).json(updatedRent);
    res.status(200).send(updatedRent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an Monthly Rent
router.patch('/update/:id', async (req, res) => {
  try {
    const id = await Rent.findOne({ propertyId: req.params.id, year: req.body.year });
    const updatedRent = await Rent.findByIdAndUpdate(
      id._id,
      {
        $push: {
          'rent': {
            'month': req.body.month,
            'amount': req.body.amount,
            'date': req.body.date,
          }
        }
      },
      {
        new: true,
      }
    );
    if (!updatedRent) return res.status(404).json({ error: 'Rent not found' });
    res.status(200).send(updatedRent);
    // await updatedRent.save();
    // res.status(200).json(updatedRent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an Rent
router.delete('/:id', async (req, res) => {
  try {
    const deletedRent = await Rent.findByIdAndDelete(req.params.id);
    if (!deletedRent) return res.status(404).json({ error: 'Rent not found' });
    res.status(200).json({ message: 'Rent deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
