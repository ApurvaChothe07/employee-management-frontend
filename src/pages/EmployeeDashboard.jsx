import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import { formatRoleName } from '../utils/roleUtils';

export default function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const accessDeniedNotice = location.state?.accessDenied;

  return (
    <DashboardLayout title="Employee Workspace">
      {/* Access Denied Notice if redirected from admin routes */}
      {accessDeniedNotice && (
        <div className="alert alert-warning" role="alert">
          <span style={{ fontSize: '1.2rem' }}>🔒</span>
          <div style={{ flex: 1 }}>
            <strong>Access Restricted:</strong> You attempted to navigate to an administrator-only section.
            Your current account possesses <strong>{formatRoleName(user?.role)}</strong> privileges, which restricts employee CRUD management.
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="welcome-card" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #1e3a8a 100%)' }}>
        <h1 className="welcome-title">Hello, {user?.username || 'Employee'}!</h1>
        <p className="welcome-desc">
          Welcome to the Employee Management System employee portal. Here you can review your account information and organization directory details.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Account Summary Card */}
        <div className="card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>👤</span>
            <span>My Account Overview</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Username:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{user?.username}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Assigned Role:</span>
              <span className="badge badge-employee">{formatRoleName(user?.role)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Authentication:</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>● Active (JWT Verified)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Permissions:</span>
              <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Read-only profile & workspace</span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/profile" className="btn btn-primary" style={{ flex: 1 }}>
              View Full Profile
            </Link>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={logout}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Workplace Policy & Notice Card */}
        <div className="card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>ℹ️</span>
            <span>Role & Security Notice</span>
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' }}>
            In this system, user authorization is strictly enforced by the Spring Boot backend using Spring Security.
          </p>

          <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>
            <li>Standard employee accounts have read access to their profile and self-service portals.</li>
            <li>Employee record modifications (creating, editing, and deleting records) require Administrator clearance.</li>
            <li>To request elevated administrator permissions, please contact your organization system administrator.</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
