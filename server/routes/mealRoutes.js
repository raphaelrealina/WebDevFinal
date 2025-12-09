const express = require('express');
const Meal = require('../models/meal');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all meals for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const meals = await Meal.find({ userId: req.userId }).sort({ date: -1 });
        return res.json(meals);
    } catch (err) {
        return res.status(500).json({ error: 'Could not fetch meals', details: err.message });
    }
});

// Create a new meal
router.post('/', auth, async (req, res) => {
    try {
        const meal = new Meal({ ...req.body, userId: req.userId });
        await meal.save();
        return res.status(201).json(meal);
    } catch (err) {
        return res.status(500).json({ error: 'Could not create meal', details: err.message });
    }
});

// Delete a meal
router.delete('/:id', auth, async (req, res) => {
    try {
        const meal = await Meal.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!meal) {
            return res.status(404).json({ error: 'Meal not found' });
        }
        return res.json({ message: 'Meal deleted' });
    } catch (err) {
        return res.status(500).json({ error: 'Could not delete meal', details: err.message });
    }
});

module.exports = router;
