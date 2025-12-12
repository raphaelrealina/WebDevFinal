import React, { useState } from 'react';
// Registration page to create an account and capture goal weight.
import Topbar from '../components/Topbar';
import './RegisterPage.css';

const defaultRegisterForm = {
    username: '',
    email: '',
    password: '',
    goalWeight: '',
    age: '',
    weight: '',
    height: '',
};

const RegisterPage = ({ backendStatus, onSubmit, onHome, onLogin, onRegister }) => {
    const [form, setForm] = useState(defaultRegisterForm);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const payload = {
            username: form.username.trim(),
            email: form.email.trim(),
            password: form.password,
            goalWeight: form.goalWeight ? Number(form.goalWeight) : undefined,
            age: form.age ? Number(form.age) : undefined,
            weight: form.weight ? Number(form.weight) : undefined,
            height: form.height ? Number(form.height) : undefined,
        };

        if (!payload.username || !payload.email || !payload.password) {
            setError('Username, email, and password are required.');
            return;
        }

        try {
            await onSubmit(payload);
            setForm(defaultRegisterForm);
            setMessage('Account created. Redirecting to dashboard...');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="page-shell">
            <Topbar onHome={onHome} onLogin={onLogin} onRegister={onRegister} />
            <div className="auth-page">
                <header className="auth-header">
                    <div>
                        <p className="eyebrow">Create your FitTrack account</p>
                        <h1>Register</h1>
                    </div>
                </header>

                <div className="card auth-card">
                    <div className="card-header">
                        <h2>Create account</h2>
                    </div>
                    <form className="form-grid" onSubmit={handleSubmit}>
                        <label>
                            Username
                            <input name="username" value={form.username} onChange={handleChange('username')} placeholder="fitfan123" />
                        </label>
                        <label>
                            Email
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange('email')}
                                placeholder="you@example.com"
                                autoComplete="email"
                            />
                        </label>
                        <label>
                            Password
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange('password')}
                                placeholder="At least 8 characters"
                                autoComplete="new-password"
                            />
                        </label>
                        <label>
                            Goal weight (lbs)
                            <input
                                name="goalWeight"
                                type="number"
                                min="0"
                                value={form.goalWeight}
                                onChange={handleChange('goalWeight')}
                                placeholder="150"
                            />
                        </label>
                        <div className="form-columns">
                            <label>
                                Age
                                <input
                                    name="age"
                                    type="number"
                                    min="0"
                                    value={form.age}
                                    onChange={handleChange('age')}
                                    placeholder="28"
                                />
                            </label>
                            <label>
                                Weight (lbs)
                                <input
                                    name="weight"
                                    type="number"
                                    min="0"
                                    value={form.weight}
                                    onChange={handleChange('weight')}
                                    placeholder="165"
                                />
                            </label>
                            <label>
                                Height (in)
                                <input
                                    name="height"
                                    type="number"
                                    min="0"
                                    value={form.height}
                                    onChange={handleChange('height')}
                                    placeholder="70"
                                />
                            </label>
                        </div>
                        <button type="submit">Register</button>
                    </form>
                    {(message || error) && <p className={error ? 'message error' : 'message success'}>{error || message}</p>}
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
