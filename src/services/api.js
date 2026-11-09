import axios from 'axios';
import { getStoredToken, isTokenExpired, removeStoredAuth } from '../utils/tokenUtils';

// Read API Base URL from Vite environment variables (fallback to local Spring Boot port 8081)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

/**
 * Centralized Axios instance
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000 // 15 second request timeout
});

/**
 * Request Interceptor: Automatically attach Bearer token to outgoing protected requests
 */
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      if (isTokenExpired(token)) {
        // Token has expired; remove stale credentials
        removeStoredAuth();
      } else {
        // Attach valid JWT token using Bearer scheme expected by Spring Security
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Centralized error handling for 401, 403, and Network errors
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 1. Network or CORS Error (No HTTP response from server)
    if (!error.response) {
      console.error('Network/CORS Error: Backend server is unreachable at', API_BASE_URL);
      const networkError = new Error(
        'Unable to reach backend server. Please verify the backend service is running and CORS is permitted.'
      );
      networkError.status = 0;
      return Promise.reject(networkError);
    }

    const { status, data } = error.response;

    // 2. HTTP 401 Unauthorized (Expired or invalid token)
    if (status === 401) {
      const isAuthEndpoint = error.config.url?.includes('/api/auth/');
      if (!isAuthEndpoint) {
        console.warn('Session expired or unauthorized. Clearing authentication.');
        removeStoredAuth();
        // Redirect to login if in browser environment
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = '/login?expired=true';
        }
      }
    }

    // 3. HTTP 403 Forbidden (Role-based access violation)
    if (status === 403) {
      console.warn('Access denied (403 Forbidden). Insufficient permissions.');
    }

    // Extract meaningful error message from backend ErrorResponse DTO
    let extractedMessage = 'An unexpected error occurred.';
    if (data) {
      if (typeof data === 'string') {
        extractedMessage = data;
      } else if (data.message) {
        extractedMessage = data.message;
        // If validation error map exists, append details
        if (data.errors && typeof data.errors === 'object') {
          const fieldErrors = Object.entries(data.errors)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(', ');
          if (fieldErrors) {
            extractedMessage = `${data.message} (${fieldErrors})`;
          }
        }
      }
    }

    const enhancedError = new Error(extractedMessage);
    enhancedError.status = status;
    enhancedError.response = error.response;
    enhancedError.backendErrors = data?.errors || null;

    return Promise.reject(enhancedError);
  }
);

export default api;
