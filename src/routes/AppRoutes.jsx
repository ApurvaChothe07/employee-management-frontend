import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLES, isAdmin } from '../utils/roleUtils';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleBasedRoute from '../components/RoleBasedRoute';
import Loading from '../components/Loading';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminDashboard from '../pages/AdminDashboard';
import EmployeeDashboard from '../pages/EmployeeDashboard';
import EmployeeList from '../pages/EmployeeList';
import AddEmployee from '../pages/AddEmployee';
import EditEmployee from '../pages/EditEmployee';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

// Root Index Redirector based on user authentication and role
function IndexRedirect() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading message="Loading application..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return isAdmin(user)
    ? <Navigate to="/admin/dashboard" replace />
    : <Navigate to="/employee/dashboard" replace />;
}

// Redirect away from login/register if already logged in
function PublicOnlyRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading message="Checking session..." />;
  }

  if (isAuthenticated && user) {
    return isAdmin(user)
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/employee/dashboard" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<IndexRedirect />} />

      {/* Public Authentication Routes */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      {/* Admin-only Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
              <EmployeeList />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees/new"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
              <AddEmployee />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees/edit/:id"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
              <EditEmployee />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      {/* Employee Dashboard */}
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.ADMIN]}>
              <EmployeeDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      {/* Authenticated User Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
