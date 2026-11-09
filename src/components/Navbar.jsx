import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { formatRoleName, isAdmin } from '../utils/roleUtils';

export default function Navbar({ title, onToggleSidebar }) {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-left">
        {onToggleSidebar && (
          <button
            type="button"
            className="navbar-menu-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
          >
            ☰
          </button>
        )}
        <div className="navbar-title">
          {title || 'Employee Management System'}
        </div>
      </div>

      <div className="navbar-actions">
        {user && (
          <span className={`badge ${isAdmin(user) ? 'badge-admin' : 'badge-employee'}`}>
            {formatRoleName(user.role)}
          </span>
        )}
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={logout}
          title="Sign out of current session"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
