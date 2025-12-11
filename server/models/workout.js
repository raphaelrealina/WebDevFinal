const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    exercise: {
        type: String,
        required: true,
        trim: true
    },
    duration: Number, //for things like planks, cardio, etc.
    sets: Number,
    reps: Number,
    weight: Number,
    bodyWeight: Number,
    notes: {
        type: String,
        trim: true
    }
});

module.exports = mongoose.model('Workout', workoutSchema);
