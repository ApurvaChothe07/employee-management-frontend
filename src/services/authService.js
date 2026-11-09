import api from './api';
import { removeStoredAuth } from '../utils/tokenUtils';

/**
 * Authentication Service
 * Communicates with backend AuthController endpoints:
 * - POST /api/auth/login
 * - POST /api/auth/register
 */
export const authService = {
  /**
   * Log in user with username and password
   * @param {string} username
   * @param {string} password
   * @returns {Promise<{token: string, username: string, role: string}>}
   */
  async login(username, password) {
    const response = await api.post('/api/auth/login', {
      username,
      password
    });
    return response.data;
  },

  /**
   * Register a new user
   * (Spring Boot backend automatically assigns role "EMPLOYEE")
   * @param {string} username
   * @param {string} password
   * @returns {Promise<{message: string, username: string, role: string}>}
   */
  async register(username, password) {
    const response = await api.post('/api/auth/register', {
      username,
      password
    });
    return response.data;
  },

  /**
   * Log out current user and clear browser session storage
   */
  logout() {
    removeStoredAuth();
  }
};

export default authService;
