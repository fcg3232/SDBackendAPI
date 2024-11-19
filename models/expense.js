const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    propertyId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',
        required: true 
    },
    year: { 
        type: Number, 
        required: true 
    },
    expenses: [{
        category: { 
            type: String, 
            required: true,
            enum: [
                'Maintenance', 
                'Property Management', 
                'Insurance', 
                'Property Taxes', 
                'Utilities', 
                'Other'
            ]
        },
        amount: { 
            type: Number, 
            required: true,
            min: 0 
        },
        description: { 
            type: String, 
            default: '' 
        },
        date: { 
            type: Date, 
            required: true 
        }
    }],
    totalExpense: { 
        type: Number, 
        default: 0 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

ExpenseSchema.pre("save", function (next) {
    if (Array.isArray(this.expenses)) {
        this.totalExpense = this.expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    } else {
        this.totalExpense = 0;
    }
    this.updatedAt = Date.now();
    next();
});

const Expense = mongoose.model('Expense', ExpenseSchema);

exports.Expense = Expense;
