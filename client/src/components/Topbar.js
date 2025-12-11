import React from 'react';
import './Topbar.css';

const Topbar = ({ onHome, onLogin, onRegister, onLogout, isAuthed }) => {
    return (
        <nav className="topbar">
            <button className="brand" onClick={() => onHome && onHome()}>
                FitTrack
            </button>
            <div className="topbar-actions">
                {isAuthed ? (
                    <>
                        <button className="secondary" onClick={() => onLogout && onLogout()}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button className="ghost" onClick={() => onLogin && onLogin()}>
                            Login
                        </button>
                        <button className="primary" onClick={() => onRegister && onRegister()}>
                            Create account
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Topbar;
