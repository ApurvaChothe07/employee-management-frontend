import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import authService from '../services/authService';
import {
  getStoredToken,
  getStoredUser,
  setStoredAuth,
  removeStoredAuth,
  isTokenExpired,
  decodeToken
} from '../utils/tokenUtils';
import { ROLES, normalizeRole } from '../utils/roleUtils';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore authenticated session from localStorage on application bootstrap
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = getStoredToken();
        const storedUser = getStoredUser();

        if (storedToken && !isTokenExpired(storedToken)) {
          // Token is valid; verify structure
          const decoded = decodeToken(storedToken);
          if (decoded && decoded.sub) {
            const restoredUser = storedUser || {
              username: decoded.sub,
              role: decoded.role || ROLES.EMPLOYEE
            };
            setToken(storedToken);
            setUser(restoredUser);
          } else {
            removeStoredAuth();
            setToken(null);
            setUser(null);
          }
        } else {
          // Token is missing or expired
          removeStoredAuth();
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to restore authentication session:', err);
        removeStoredAuth();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Log in user using credentials, save token, and update state
   * @param {string} username
   * @param {string} password
   * @returns {Promise<object>} User session data { username, role }
   */
  const login = useCallback(async (username, password) => {
    const data = await authService.login(username, password);

    // data format from LoginResponseDTO: { token, username, role }
    if (!data.token) {
      throw new Error('Authentication succeeded but no JWT token was received.');
    }

    const userData = {
      username: data.username,
      role: normalizeRole(data.role)
    };

    setStoredAuth(data.token, userData);
    setToken(data.token);
    setUser(userData);

    return userData;
  }, []);

  /**
   * Register a new user
   * @param {string} username
   * @param {string} password
   * @returns {Promise<object>} RegisterResponseDTO { message, username, role }
   */
  const register = useCallback(async (username, password) => {
    return await authService.register(username, password);
  }, []);

  /**
   * Log out user, clean local storage, and reset state
   */
  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  }, []);

  const authValue = useMemo(() => {
    const userRole = user ? normalizeRole(user.role) : null;
    return {
      token,
      user,
      isAuthenticated: Boolean(token && user && !isTokenExpired(token)),
      isAdmin: userRole === ROLES.ADMIN,
      isEmployee: userRole === ROLES.EMPLOYEE,
      loading,
      login,
      register,
      logout
    };
  }, [token, user, loading, login, register, logout]);

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};
