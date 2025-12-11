import React from 'react';
// Marketing/entry page with CTA to register or log in.
import Topbar from '../components/Topbar';
import './LandingPage.css';

const LandingPage = ({ backendStatus, onGetStarted, onLogin, onCreateAccount, onHome, onLogout, isAuthed }) => {
    return (
        <div className="page-shell">
            <Topbar
                onHome={onHome}
                onLogin={onLogin}
                onRegister={onCreateAccount}
                onLogout={onLogout}
                isAuthed={isAuthed}
            />

            <main className="landing-hero">
                <div className="landing-text">
                    <p className="eyebrow">FitTrack</p>
                    <h1>Stay on top of your workouts and meals.</h1>
                    <p className="landing-subtitle">
                        Log workouts, track meals, and see your progress in one dashboard.
                    </p>
                    <div className="landing-badges">
                        <span className="pill">Log Workouts</span>
                        <span className="pill">Log Meals</span>
                        <span className="pill">Track Progress Over Time</span>
                    </div>
                </div>

                <div className="cta-section">
                    <button className="cta-button" onClick={onGetStarted}>
                        Get started
                    </button>
                    <p className="muted small">You’ll create an account on the next step.</p>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
