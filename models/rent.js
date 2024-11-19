const mongoose = require('mongoose');

const RentSchema = new mongoose.Schema({
    propertyId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',
        required: true 
    },
    year: { 
        type: Number, 
        required: true 
    },
    rent: [{
        month: { 
            type: String, 
            required: true 
        },
        amount: { 
            type: Number, 
            required: true,
            min: 0 
        },
        date: { 
            type: Date, 
            required: true 
        }
    }],
    annualRentalIncome: { 
        type: Number, 
        default: 0 
    },
    rentalYield: { 
        type: Number, 
        default: 0 
    },
    annualCoC: { 
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

// Pre-save hook to calculate totalExpense automatically
RentSchema.pre('save', function (next) {
    this.annualRentalIncome = this.rent.reduce((sum, rent) => sum + rent.amount, 0);
    this.updatedAt = Date.now();
    next();
});


const Rent = mongoose.model('Rent', RentSchema);

exports.Rent = Rent;
