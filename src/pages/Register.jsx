import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ErrorMessage from '../components/ErrorMessage';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Validate form matching backend constraints
  const validateForm = () => {
    const errors = {};
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      errors.username = 'Username is required';
    } else if (trimmedUsername.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (trimmedUsername.length > 50) {
      errors.username = 'Username cannot exceed 50 characters';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirming your password is required';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await register(username.trim(), password);
      setSuccessMessage(
        response.message || 'Registration successful! You may now sign in with your account.'
      );
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setFormErrors({});
    } catch (err) {
      console.error('Registration error:', err);
      if (err.status === 409) {
        setServerError('Username is already taken. Please choose another username.');
      } else {
        setServerError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">EMS</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Register a new employee management account</p>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="alert alert-success" role="alert">
            <span style={{ fontSize: '1.1rem' }}>✅</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{successMessage}</p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ marginTop: '0.5rem' }}
                onClick={() => navigate('/login')}
              >
                Proceed to Sign In
              </button>
            </div>
          </div>
        )}

        <ErrorMessage message={serverError} onDismiss={() => setServerError('')} />

        {!successMessage && (
          <form onSubmit={handleSubmit} noValidate>
            {/* Username Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-username">
                Username
              </label>
              <input
                id="reg-username"
                type="text"
                className={`form-input ${formErrors.username ? 'input-error' : ''}`}
                placeholder="Choose a username (3-50 characters)"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (formErrors.username) {
                    setFormErrors((prev) => ({ ...prev, username: '' }));
                  }
                }}
                autoComplete="username"
                disabled={isSubmitting}
              />
              {formErrors.username && (
                <span className="error-text">{formErrors.username}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">
                Password
              </label>
              <div className="input-wrapper">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${formErrors.password ? 'input-error' : ''}`}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (formErrors.password) {
                      setFormErrors((prev) => ({ ...prev, password: '' }));
                    }
                  }}
                  autoComplete="new-password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {formErrors.password && (
                <span className="error-text">{formErrors.password}</span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm-password">
                Confirm Password
              </label>
              <input
                id="reg-confirm-password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${formErrors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (formErrors.confirmPassword) {
                    setFormErrors((prev) => ({ ...prev, confirmPassword: '' }));
                  }
                }}
                autoComplete="new-password"
                disabled={isSubmitting}
              />
              {formErrors.confirmPassword && (
                <span className="error-text">{formErrors.confirmPassword}</span>
              )}
            </div>

            {/* Role Assignment Information Note */}
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              🔒 Newly registered accounts receive standard <strong>EMPLOYEE</strong> permissions by default. Administrator access is managed by organization administrators.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary auth-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner spinner-sm" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        )}

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
