const express = require('express');
const Workout = require('../models/workout');
const auth = require('../middleware/auth');

const router = express.Router();

// Get workouts for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const workouts = await Workout.find({ userId: req.userId }).sort({ _id: -1 });
        return res.json(workouts);
    } catch (err) {
        return res.status(500).json({ error: 'Could not fetch workouts', details: err.message });
    }
});

// Create new workout
router.post('/', auth, async (req, res) => {
    try {
        const workout = new Workout({ ...req.body, userId: req.userId });
        await workout.save();
        return res.status(201).json(workout);
    } catch (err) {
        return res.status(500).json({ error: 'Could not create workout', details: err.message });
    }
});

// Delete a workout
router.delete('/:id', auth, async (req, res) => {
    try {
        const workout = await Workout.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }
        return res.json({ message: 'Workout deleted' });
    } catch (err) {
        return res.status(500).json({ error: 'Could not delete workout', details: err.message });
    }
});

module.exports = router;
