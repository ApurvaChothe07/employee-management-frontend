import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { normalizeRole, ROLES } from '../utils/roleUtils';
import Loading from './Loading';

/**
 * Route wrapper that restricts access based on user role (e.g. ADMIN only)
 * @param {object} props
 * @param {string[]} props.allowedRoles - Array of allowed normalized roles, e.g. [ROLES.ADMIN]
 * @param {React.ReactNode} props.children
 */
export default function RoleBasedRoute({ allowedRoles = [], children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading message="Verifying authorization..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = normalizeRole(user.role);
  const normalizedAllowed = allowedRoles.map(normalizeRole);

  if (!normalizedAllowed.includes(userRole)) {
    // If user lacks permission, redirect to their home dashboard with accessDenied state
    const fallbackPath = userRole === ROLES.ADMIN ? '/admin/dashboard' : '/employee/dashboard';
    return (
      <Navigate
        to={fallbackPath}
        state={{ accessDenied: true, attemptedRole: normalizedAllowed.join(', ') }}
        replace
      />
    );
  }

  return children;
}
