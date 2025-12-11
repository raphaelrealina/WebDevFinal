import React, { useCallback, useEffect, useState } from 'react';
import Topbar from '../components/Topbar';
import './DashboardPage.css';

const defaultWorkoutForm = {
    exercise: '',
    duration: '',
    sets: '',
    reps: '',
    weight: '',
    notes: '',
    bodyWeight: '',
};

const defaultMealForm = {
    name: '',
    calories: '',
    protein: '',
    quantity: '1',
    notes: '',
    bodyWeight: '',
};

const pickId = (item) => item?._id || item?.id;

const DashboardPage = ({ backendStatus, token, user, apiFetch, onLogout, onHome, onDashboard }) => {
    const [workouts, setWorkouts] = useState([]);
    const [meals, setMeals] = useState([]);
    const [workoutForm, setWorkoutForm] = useState(defaultWorkoutForm);
    const [mealForm, setMealForm] = useState(defaultMealForm);
    const [workoutMessage, setWorkoutMessage] = useState('');
    const [workoutError, setWorkoutError] = useState('');
    const [mealMessage, setMealMessage] = useState('');
    const [mealError, setMealError] = useState('');
    const [loadError, setLoadError] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const loadData = useCallback(async () => {
        if (!token) return;
        setIsSyncing(true);
        setLoadError('');
        try {
            const [workoutsData, mealsData] = await Promise.all([
                apiFetch('/workouts', { method: 'GET' }),
                apiFetch('/meals', { method: 'GET' }),
            ]);
            setWorkouts(workoutsData);
            setMeals(mealsData);
        } catch (err) {
            setLoadError(err.message);
        } finally {
            setIsSyncing(false);
        }
    }, [apiFetch, token]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleWorkoutSubmit = async (event) => {
        event.preventDefault();
        setWorkoutError('');
        setWorkoutMessage('');

        if (!workoutForm.exercise.trim()) {
            setWorkoutError('Exercise name is required.');
            return;
        }

        const payload = {
            exercise: workoutForm.exercise.trim(),
            duration: workoutForm.duration ? Number(workoutForm.duration) : undefined,
            sets: workoutForm.sets ? Number(workoutForm.sets) : undefined,
            reps: workoutForm.reps ? Number(workoutForm.reps) : undefined,
            weight: workoutForm.weight ? Number(workoutForm.weight) : undefined,
            notes: workoutForm.notes.trim(),
            bodyWeight: workoutForm.bodyWeight ? Number(workoutForm.bodyWeight) : undefined,
        };

        try {
            await apiFetch('/workouts', { method: 'POST', body: JSON.stringify(payload) });
            setWorkoutForm(defaultWorkoutForm);
            setWorkoutMessage('Workout saved..');
            await loadData();
        } catch (err) {
            setWorkoutError(err.message);
        }
    };

    const handleMealSubmit = async (event) => {
        event.preventDefault();
        setMealError('');
        setMealMessage('');

        if (!mealForm.name.trim()) {
            setMealError('Meal name is required.');
            return;
        }

        const payload = {
            items: [
                {
                    name: mealForm.name.trim(),
                    calories: mealForm.calories ? Number(mealForm.calories) : 0,
                    protein: mealForm.protein ? Number(mealForm.protein) : 0,
                    quantity: mealForm.quantity ? Number(mealForm.quantity) : 1,
                },
            ],
            notes: mealForm.notes.trim(),
            bodyWeight: mealForm.bodyWeight ? Number(mealForm.bodyWeight) : undefined,
        };

        try {
            await apiFetch('/meals', { method: 'POST', body: JSON.stringify(payload) });
            setMealForm(defaultMealForm);
            setMealMessage('Meal saved.');
            await loadData();
        } catch (err) {
            setMealError(err.message);
        }
    };

    const latestWeight = (() => {
        const entries = [...workouts, ...meals]
            .filter((e) => e.bodyWeight !== undefined && e.bodyWeight !== null)
            .sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));
        if (entries.length > 0) return Number(entries[0].bodyWeight);
        if (user?.weight) return Number(user.weight);
        return null;
    })();

    const goalWeight = user?.goalWeight ? Number(user.goalWeight) : null;
    const goalDelta = goalWeight && latestWeight ? latestWeight - goalWeight : null;

    useEffect(() => {
        if (goalDelta !== null && Math.abs(goalDelta) <= 0.5) {
            setShowConfetti(true);
            const t = setTimeout(() => setShowConfetti(false), 4000);
            return () => clearTimeout(t);
        }
    }, [goalDelta]);

    const handleDeleteWorkout = async (id) => {
        setWorkoutError('');
        try {
            await apiFetch(`/workouts/${id}`, { method: 'DELETE' });
            setWorkouts((prev) => prev.filter((item) => pickId(item) !== id));
        } catch (err) {
            setWorkoutError(err.message);
        }
    };

    const handleDeleteMeal = async (id) => {
        setMealError('');
        try {
            await apiFetch(`/meals/${id}`, { method: 'DELETE' });
            setMeals((prev) => prev.filter((item) => pickId(item) !== id));
        } catch (err) {
            setMealError(err.message);
        }
    };

    return (
        <div className="page-shell">
            <Topbar onHome={onHome} onDashboard={onDashboard} onLogout={onLogout} isAuthed />
            <div className="app-shell">
                {showConfetti && (
                    <div className="confetti">
                        {Array.from({ length: 80 }).map((_, i) => {
                            const left = Math.random() * 100;
                            const dx = (Math.random() * 400 - 200).toFixed(0); // -200 to 200px
                            const dur = (2 + Math.random() * 1.5).toFixed(2);
                            const delay = (Math.random() * 0.6).toFixed(2);
                            const height = (50 + Math.random() * 50).toFixed(0); // 50-100vh
                            return (
                                <span
                                    key={i}
                                    className="confetti-piece"
                                    style={{
                                        left: `${left}%`,
                                        '--dx': `${dx}px`,
                                        '--dur': `${dur}s`,
                                        '--delay': `${delay}s`,
                                        '--height': `${height}vh`,
                                    }}
                                />
                            );
                        })}
                    </div>
                )}
                <header className="hero">
                    <div>
                        <p className="eyebrow">FitTrack</p>
                        {isSyncing && <p className="muted">Syncing with the database...</p>}
                    </div>
                    <div className="auth-state">
                        <p className="muted">Signed in as</p>
                        <p className="auth-username">{user?.username || user?.email || 'Authenticated user'}</p>
                        <button className="secondary" onClick={onLogout}>
                            Log out
                        </button>
                    </div>
                </header>

                {loadError && <p className="message error">{loadError}</p>}

                <section className="grid two">
                    <div className="card">
                        <div className="card-header">
                            <h2>Goal progress</h2>
                            <p className="muted">Track against your goal weight</p>
                        </div>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>{goalWeight || '—'}</h3>
                                <p>Goal weight (lbs)</p>
                            </div>
                            <div className="stat-card">
                                <h3>{latestWeight || '—'}</h3>
                                <p>Latest weight (lbs)</p>
                            </div>
                            <div className="stat-card">
                                <h3>
                                    {goalDelta !== null
                                        ? `${Math.abs(goalDelta).toFixed(1)} lbs ${goalDelta > 0 ? 'to lose' : 'to gain'}`
                                        : '—'}
                                </h3>
                                <p>Distance to goal</p>
                            </div>
                        </div>
                        {goalDelta !== null && Math.abs(goalDelta) <= 0.5 && (
                            <p className="message success">Goal reached!</p>
                        )}
                    </div>
                </section>

                <section className="grid two">
                    <div className="card">
                        <div className="card-header">
                            <h2>Log workout</h2>
                            <p className="muted">POST /api/workouts</p>
                        </div>
                        <form className="form-grid" onSubmit={handleWorkoutSubmit}>
                            <label>
                                Exercise
                                <input
                                    name="exercise"
                                    value={workoutForm.exercise}
                                    onChange={(e) => setWorkoutForm((prev) => ({ ...prev, exercise: e.target.value }))}
                                    placeholder="Bench press"
                                />
                            </label>
                            <div className="form-columns">
                                <label>
                                    Duration (min)
                                    <input
                                        name="duration"
                                        type="number"
                                        min="0"
                                        value={workoutForm.duration}
                                        onChange={(e) => setWorkoutForm((prev) => ({ ...prev, duration: e.target.value }))}
                                        placeholder="45"
                                    />
                                </label>
                                <label>
                                    Sets
                                    <input
                                        name="sets"
                                        type="number"
                                        min="0"
                                        value={workoutForm.sets}
                                        onChange={(e) => setWorkoutForm((prev) => ({ ...prev, sets: e.target.value }))}
                                        placeholder="3"
                                    />
                                </label>
                                <label>
                                    Reps
                                    <input
                                        name="reps"
                                        type="number"
                                        min="0"
                                        value={workoutForm.reps}
                                        onChange={(e) => setWorkoutForm((prev) => ({ ...prev, reps: e.target.value }))}
                                        placeholder="10"
                                    />
                                </label>
                                <label>
                                    Weight (lbs)
                                    <input
                                        name="weight"
                                        type="number"
                                        min="0"
                                        value={workoutForm.weight}
                                        onChange={(e) => setWorkoutForm((prev) => ({ ...prev, weight: e.target.value }))}
                                        placeholder="135"
                                    />
                                </label>
                                <label>
                                    Your current weight (lbs)
                                    <input
                                        name="bodyWeight"
                                        type="number"
                                        min="0"
                                        value={workoutForm.bodyWeight}
                                        onChange={(e) => setWorkoutForm((prev) => ({ ...prev, bodyWeight: e.target.value }))}
                                        placeholder="165"
                                    />
                                </label>
                            </div>
                            <label>
                                Notes
                                <textarea
                                    name="notes"
                                    rows="2"
                                    value={workoutForm.notes}
                                    onChange={(e) => setWorkoutForm((prev) => ({ ...prev, notes: e.target.value }))}
                                    placeholder="How did it feel?"
                                />
                            </label>
                            <button type="submit">Save workout</button>
                        </form>
                        {(workoutMessage || workoutError) && (
                            <p className={workoutError ? 'message error' : 'message success'}>
                                {workoutError || workoutMessage}
                            </p>
                        )}
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h2>Log meal</h2>
                            <p className="muted">POST /api/meals</p>
                        </div>
                        <form className="form-grid" onSubmit={handleMealSubmit}>
                            <label>
                                Meal name
                                <input
                                    name="name"
                                    value={mealForm.name}
                                    onChange={(e) => setMealForm((prev) => ({ ...prev, name: e.target.value }))}
                                    placeholder="Grilled chicken salad"
                                />
                            </label>
                            <div className="form-columns">
                                <label>
                                    Calories
                                    <input
                                        name="calories"
                                        type="number"
                                        min="0"
                                        value={mealForm.calories}
                                        onChange={(e) => setMealForm((prev) => ({ ...prev, calories: e.target.value }))}
                                        placeholder="450"
                                    />
                                </label>
                                <label>
                                    Protein (g)
                                    <input
                                        name="protein"
                                        type="number"
                                        min="0"
                                        value={mealForm.protein}
                                        onChange={(e) => setMealForm((prev) => ({ ...prev, protein: e.target.value }))}
                                        placeholder="35"
                                    />
                                </label>
                                <label>
                                    Quantity
                                    <input
                                        name="quantity"
                                        type="number"
                                        min="1"
                                        value={mealForm.quantity}
                                        onChange={(e) => setMealForm((prev) => ({ ...prev, quantity: e.target.value }))}
                                        placeholder="1"
                                    />
                                </label>
                                <label>
                                    Your current weight (lbs)
                                    <input
                                        name="bodyWeight"
                                        type="number"
                                        min="0"
                                        value={mealForm.bodyWeight}
                                        onChange={(e) => setMealForm((prev) => ({ ...prev, bodyWeight: e.target.value }))}
                                        placeholder="165"
                                    />
                                </label>
                            </div>
                            <label>
                                Notes
                                <textarea
                                    name="notes"
                                    rows="2"
                                    value={mealForm.notes}
                                    onChange={(e) => setMealForm((prev) => ({ ...prev, notes: e.target.value }))}
                                    placeholder="Carbs, fats, or other details"
                                />
                            </label>
                            <button type="submit">Save meal</button>
                        </form>
                        {(mealMessage || mealError) && <p className={mealError ? 'message error' : 'message success'}>{mealError || mealMessage}</p>}
                    </div>
                </section>

                <section className="grid two">
                    <div className="card">
                        <div className="card-header">
                            <h2>Recent workouts</h2>
                            <p className="muted">GET /api/workouts</p>
                        </div>
                        {workouts.length === 0 ? (
                            <p className="muted">No workouts yet.</p>
                        ) : (
                            <ul className="item-list">
                                {workouts.map((workout) => {
                                    const id = pickId(workout);
                                    return (
                                        <li key={id} className="item">
                                            <div>
                                                <div className="item-title">{workout.exercise}</div>
                                                <div className="item-meta">
                                                    {workout.duration ? <span className="pill">{workout.duration} min</span> : null}
                                                    {workout.sets ? <span className="pill">{workout.sets} sets</span> : null}
                                                    {workout.reps ? <span className="pill">{workout.reps} reps</span> : null}
                                                    {workout.weight ? <span className="pill">{workout.weight} lbs</span> : null}
                                                </div>
                                                {workout.notes && <p className="muted small">{workout.notes}</p>}
                                            </div>
                                            <button className="ghost" onClick={() => handleDeleteWorkout(id)}>
                                                Delete
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h2>Recent meals</h2>
                            <p className="muted">GET /api/meals</p>
                        </div>
                        {meals.length === 0 ? (
                            <p className="muted">No meals yet.</p>
                        ) : (
                            <ul className="item-list">
                                {meals.map((meal) => {
                                    const id = pickId(meal);
                                    const firstItem = meal.items && meal.items[0] ? meal.items[0] : {};
                                    return (
                                        <li key={id} className="item">
                                            <div>
                                                <div className="item-title">{firstItem.name || 'Meal'}</div>
                                                <div className="item-meta">
                                                    {typeof meal.totalCalories === 'number' ? <span className="pill">{meal.totalCalories} cal</span> : null}
                                                    {typeof meal.totalProtein === 'number' ? <span className="pill">{meal.totalProtein} g protein</span> : null}
                                                    {firstItem.quantity ? <span className="pill">x{firstItem.quantity}</span> : null}
                                                </div>
                                                {meal.notes && <p className="muted small">{meal.notes}</p>}
                                            </div>
                                            <button className="ghost" onClick={() => handleDeleteMeal(id)}>
                                                Delete
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DashboardPage;
