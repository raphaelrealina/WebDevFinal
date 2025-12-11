import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

const API_BASE = '/api';

function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [backendStatus, setBackendStatus] = useState('Connecting to backend...');
    const [token, setToken] = useState(() => localStorage.getItem('token') || '');
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        } catch (err) {
            return null;
        }
    });

    useEffect(() => {
        fetch(`${API_BASE}/status`)
            .then((res) => (res.ok ? res.json() : Promise.reject()))
            .then((data) => {
                setBackendStatus(data.message || 'API reachable');
            })
            .catch(() => setBackendStatus('Unable to reach backend API'));
    }, []);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }, [token]);

    useEffect(() => {
        // If already authenticated and landing is requested, jump to dashboard
        if (token && location.pathname === '/') {
            navigate('/dashboard', { replace: true });
        }
    }, [token, location.pathname, navigate]);

    const apiFetch = useCallback(
        async (path, options = {}, overrideToken) => {
            const activeToken = overrideToken !== undefined ? overrideToken : token;
            const headers = {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
                ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
            };

            const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
            let data = {};
            try {
                data = await response.json();
            } catch (err) {
                data = {};
            }

            if (!response.ok) {
                const message = data.error || data.details || data.message || `Request failed with status ${response.status}`;
                throw new Error(message);
            }

            return data;
        },
        [token]
    );

    const handleRegister = async (payload) => {
        const data = await apiFetch('/users/register', { method: 'POST', body: JSON.stringify(payload) }, '');
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard', { replace: true });
        return data;
    };

    const handleLogin = async (payload) => {
        const data = await apiFetch('/users/login', { method: 'POST', body: JSON.stringify(payload) }, '');
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard', { replace: true });
        return data;
    };

    const handleLogout = () => {
        setToken('');
        setUser(null);
        localStorage.removeItem('user');
        navigate('/', { replace: true });
    };

    const goHome = () => navigate('/', { replace: true });
    const goLogin = () => navigate('/login');
    const goRegister = () => navigate('/register');
    const goDashboard = () => navigate('/dashboard');

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <LandingPage
                        backendStatus={backendStatus}
                        onGetStarted={goRegister}
                        onLogin={goLogin}
                        onCreateAccount={goRegister}
                        onHome={goHome}
                        isAuthed={!!token}
                        onLogout={handleLogout}
                    />
                }
            />
            <Route
                path="/register"
                element={
                    token ? (
                        <Navigate to="/dashboard" replace />
                    ) : (
                        <RegisterPage
                            backendStatus={backendStatus}
                            onSubmit={handleRegister}
                            onHome={goHome}
                            onLogin={goLogin}
                            onRegister={goRegister}
                        />
                    )
                }
            />
            <Route
                path="/login"
                element={
                    token ? (
                        <Navigate to="/dashboard" replace />
                    ) : (
                        <LoginPage
                            backendStatus={backendStatus}
                            onSubmit={handleLogin}
                            onHome={goHome}
                            onLogin={goLogin}
                            onRegister={goRegister}
                        />
                    )
                }
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute token={token}>
                        <DashboardPage
                            backendStatus={backendStatus}
                            token={token}
                            user={user}
                            apiFetch={apiFetch}
                            onLogout={handleLogout}
                            onHome={goHome}
                        />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to={token ? '/dashboard' : '/'} replace />} />
        </Routes>
    );
}

export default App;
