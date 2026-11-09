/**
 * Token and Local Storage Utility Functions
 */

const TOKEN_KEY = 'ems_auth_token';
const USER_KEY = 'ems_auth_user';

/**
 * Safely parse a JWT payload without external libraries
 * @param {string} token - The raw JWT token string
 * @returns {object|null} Decoded payload object or null if invalid
 */
export const decodeToken = (token) => {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

/**
 * Check whether a JWT token is expired
 * @param {string} token
 * @returns {boolean} True if expired or invalid, false if valid
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  // exp is in seconds; Date.now() is in milliseconds
  return decoded.exp * 1000 < Date.now();
};

/**
 * Get stored token from localStorage
 * @returns {string|null}
 */
export const getStoredToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (err) {
    console.error('Failed to get token from storage:', err);
    return null;
  }
};

/**
 * Get stored user profile from localStorage
 * @returns {object|null}
 */
export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Failed to get user from storage:', err);
    return null;
  }
};

/**
 * Store token and user profile in localStorage
 * @param {string} token
 * @param {object} user
 */
export const setStoredAuth = (token, user) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to set auth in storage:', err);
  }
};

/**
 * Remove auth items from localStorage
 */
export const removeStoredAuth = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (err) {
    console.error('Failed to clear storage:', err);
  }
};
