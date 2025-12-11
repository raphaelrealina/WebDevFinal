const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    // --- Authentication Fields ---
    username: {
        type: String,
        required: true,
        unique: true, // Must be unique for account identity
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'],
    },
    
    // --- Profile/Goal Fields from Teammate ---
    goals: {
        type: String,
        required: false,
        trim: true
    },
    age: {
        type: Number,
        required: false,
    },
    weight: {
        type: Number,
        required: false,
    },
    height: {
        type: Number,
        required: false
    },
    goalWeight: {
        type: Number,
        required: false,
    }
}, {
    timestamps: true,
});

// ----------------------------------------------------------------
// PRE-SAVE HOOK: HASH PASSWORD BEFORE SAVING
// This ensures the password is never stored in plain text.
// ----------------------------------------------------------------
userSchema.pre('save', async function(next) {
    // Only run this if password was modified or is new
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// ----------------------------------------------------------------
// INSTANCE METHOD: COMPARE PASSWORD DURING LOGIN
// ----------------------------------------------------------------
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
