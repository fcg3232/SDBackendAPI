const { Expense } = require("../models/expense");
const { auth, isUser, isAdmin } = require("../middleware/auth")
const router = require("express").Router();

//CREATE
// router.post("/", async (req, res) => {
//   try {
//     const exp = new Expense({
//       propertyId: req.body.propertyId,
//       year: req.body.year,
//       expenses:[
//         {
//           category:req.body.category,
//           amount: req.body.amount,
//           description: req.body.description,
//           date: req.body.date,
//         }
//       ]
//     });
//     const savedexp = await exp.save();
//     res.status(200).send(savedexp);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// })

// Create a new Expense
router.post('/', async (req, res) => {
  try {
    const expense = new Expense(req.body);
    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all Expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().populate('propertyId');
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single Expense by ID
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate('propertyId');
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an Expense
router.put('/:id', async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedExpense) return res.status(404).json({ error: 'Expense not found' });
    // await updatedExpense.save();
    // res.status(200).json(updatedExpense);
    res.status(200).send(updatedExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 6703b8933eb8fe6daf7ed7ff
// Update an Expense
router.patch('/update/:id', async (req, res) => {
  try {
    const id = await Expense.findOne({ propertyId: req.params.id, year: req.body.year });
    const updatedExpense = await Expense.findByIdAndUpdate(
      id._id,
      {
        $push: {
          'expenses': {
            'category': req.body.category,
            'amount': req.body.amount,
            'description': req.body.description,
            'date': req.body.date,
          }
        }
      },
      {
        new: true,
      }
    );
    if (!updatedExpense) return res.status(404).json({ error: 'Expense not found' });
    res.status(200).send(updatedExpense);
    // await updatedExpense.save();
    // res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an Expense
router.delete('/:id', async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) return res.status(404).json({ error: 'Expense not found' });
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
