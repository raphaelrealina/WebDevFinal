const express = require('express');
const Workout = require('../models/workout');
const auth = require('../middleware/auth');

const router = express.Router();

// Get workouts for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const workouts = await Workout.find({ userId: req.userId }).sort({ date: -1, _id: -1 });
        return res.status(200).json(workouts);
    } catch (err) {
        return res.status(500).json({ error: 'Could not fetch workouts', details: err.message });
    }
});

// Create new workout
router.post('/', auth, async (req, res) => {
    const { exercise, duration, sets, reps, weight, notes = '', date, bodyWeight } = req.body || {};
    if (!exercise) {
        return res.status(400).json({ error: 'exercise is required' });
    }

    const parsedDate = date ? new Date(date) : new Date();
    const workoutData = {
        userId: req.userId,
        exercise: exercise.trim(),
        duration: duration !== undefined && duration !== '' ? Number(duration) : undefined,
        sets: sets !== undefined && sets !== '' ? Number(sets) : undefined,
        reps: reps !== undefined && reps !== '' ? Number(reps) : undefined,
        weight: weight !== undefined && weight !== '' ? Number(weight) : undefined,
        notes: notes,
        date: isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
        bodyWeight: bodyWeight !== undefined && bodyWeight !== '' ? Number(bodyWeight) : undefined,
    };

    try {
        const workout = new Workout(workoutData);
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
        return res.status(200).json({ message: 'Workout deleted' });
    } catch (err) {
        return res.status(500).json({ error: 'Could not delete workout', details: err.message });
    }
});

module.exports = router;
