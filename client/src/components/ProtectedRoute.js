import React from 'react';
// Guard route so only authed users can view children.
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ token, children }) => {
    if (!token) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default ProtectedRoute;
