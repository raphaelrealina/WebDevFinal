const mongoose = require('mongoose');

const mealItemSchema = new mongoose.Schema({
    name: { //(e.g., "Chicken Breast", "Broccoli")
        type: String,
        required: true,
        trim: true
    },
    calories: Number,
    protein: Number,
    quantity: {
        type: Number,
        default: 1
    }
});

const mealSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: {
        type: [mealItemSchema],
        default: []
    },
    totalCalories: {
        type: Number,
        default: 0
    },
    totalProtein: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        trim: true
    }
});

mealSchema.pre('save', function(next) {
    this.totalCalories = this.items.reduce((sum, item) => sum + (item.calories || 0) * item.quantity, 0);
    this.totalProtein = this.items.reduce((sum, item) => sum + (item.protein || 0) * item.quantity, 0);
    next();
});

module.exports = mongoose.model('Meal', mealSchema);