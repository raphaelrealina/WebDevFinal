import React, { useState } from 'react';
// Standalone login page that posts credentials to the API.
import Topbar from '../components/Topbar';
import './LoginPage.css';

const defaultLoginForm = {
    email: '',
    password: '',
};

const LoginPage = ({ backendStatus, onSubmit, onHome, onLogin, onRegister }) => {
    const [form, setForm] = useState(defaultLoginForm);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!form.email || !form.password) {
            setError('Email and password are required.');
            return;
        }

        try {
            await onSubmit(form);
            setForm(defaultLoginForm);
            setMessage('Signed in. Redirecting to dashboard...');
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
                        <p className="eyebrow">Welcome back</p>
                        <h1>Login</h1>
                        <p className="status-badge">
                            Backend status: <span className="status-text">{backendStatus}</span>
                        </p>
                    </div>
                </header>

                <div className="card auth-card">
                    <div className="card-header">
                        <h2>Login</h2>
                        <p className="muted">POST /api/users/login</p>
                    </div>
                    <form className="form-grid" onSubmit={handleSubmit}>
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
                                placeholder="Your password"
                                autoComplete="current-password"
                            />
                        </label>
                        <button type="submit">Login</button>
                    </form>
                    {(message || error) && <p className={error ? 'message error' : 'message success'}>{error || message}</p>}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
