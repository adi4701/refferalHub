import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { PageLoadingSpinner } from '../ui';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
    const { isAuthed, user, isLoading } = useAuthStore();

    if (isLoading) {
        return <PageLoadingSpinner />;
    }

    if (!isAuthed) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};
