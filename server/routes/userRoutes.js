const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

const buildUserResponse = (user) => ({
    id: user._id,
    username: user.username,
    email: user.email,
    goals: user.goals,
    age: user.age,
    weight: user.weight,
    height: user.height,
});

const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register new user
router.post('/register', async (req, res) => {
    const { username, email, password, goals, age, weight, height } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'username, email, and password are required' });
    }

    try {
        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing) {
            return res.status(409).json({ error: 'User with that email or username already exists' });
        }

        const user = new User({ username, email, password, goals, age, weight, height });
        await user.save();

        const token = signToken(user._id);
        return res.status(201).json({ user: buildUserResponse(user), token });
    } catch (err) {
        return res.status(500).json({ error: 'Could not register user', details: err.message });
    }
});

// Login existing user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = signToken(user._id);
        return res.status(200).json({ user: buildUserResponse(user), token });
    } catch (err) {
        return res.status(500).json({ error: 'Could not login', details: err.message });
    }
});

module.exports = router;
