import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import { formatRoleName, isAdmin } from '../utils/roleUtils';
import { decodeToken } from '../utils/tokenUtils';

export default function Profile() {
  const { user, token, logout } = useAuth();
  const tokenPayload = decodeToken(token);

  const formatDate = (timestampSec) => {
    if (!timestampSec) return 'N/A';
    return new Date(timestampSec * 1000).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'medium'
    });
  };

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <DashboardLayout title="User Profile">
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Profile Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 700,
              boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)'
            }}
          >
            {initial}
          </div>

          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              {user?.username}
            </h1>
            <span className={`badge ${isAdmin(user) ? 'badge-admin' : 'badge-employee'}`}>
              {formatRoleName(user?.role)}
            </span>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Username
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600 }}>{user?.username}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Account Role
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600 }}>{formatRoleName(user?.role)}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Session Issued At
            </div>
            <div style={{ fontSize: '0.95rem' }}>{formatDate(tokenPayload?.iat)}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Session Expires At
            </div>
            <div style={{ fontSize: '0.95rem' }}>{formatDate(tokenPayload?.exp)}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Security Architecture
            </div>
            <div style={{ fontSize: '0.95rem' }}>Spring Security Stateless JWT</div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Authentication Status
            </div>
            <div style={{ color: 'var(--success)', fontWeight: 600 }}>Active (Verified)</div>
          </div>
        </div>

        {/* Sign Out Action */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            type="button"
            className="btn btn-danger"
            onClick={logout}
          >
            Sign Out of Session
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
