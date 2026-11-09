import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isAdmin, formatRoleName } from '../utils/roleUtils';

export default function Sidebar({ isOpen = false, onClose }) {
  const { user } = useAuth();
  const adminUser = isAdmin(user);

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className={`sidebar ${isOpen ? 'is-open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand-wrapper">
          <div className="sidebar-logo-icon">EMS</div>
          <div className="sidebar-brand-name">EMS Portal</div>
        </div>
        <button
          type="button"
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      <nav className="sidebar-nav">
        {adminUser ? (
          <>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <span>📊</span>
              <span>Overview</span>
            </NavLink>
            <NavLink
              to="/employees"
              end
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <span>👥</span>
              <span>Employees</span>
            </NavLink>
            <NavLink
              to="/employees/new"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <span>➕</span>
              <span>Add Employee</span>
            </NavLink>
          </>
        ) : (
          <NavLink
            to="/employee/dashboard"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            <span>🏠</span>
            <span>My Dashboard</span>
          </NavLink>
        )}

        <NavLink
          to="/profile"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          onClick={handleLinkClick}
        >
          <span>👤</span>
          <span>My Profile</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-info">
          <div className="user-avatar">
            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-meta">
            <div className="user-name">{user?.username || 'User'}</div>
            <div className="user-role-label">{formatRoleName(user?.role)}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
