/**
 * Role Utility Functions
 * Handles normalization between backend authority format (e.g. "ROLE_ADMIN", "ROLE_EMPLOYEE")
 * and database/display formats ("ADMIN", "EMPLOYEE").
 */

export const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  EMPLOYEE: 'ROLE_EMPLOYEE'
};

/**
 * Normalizes role string to canonical ROLE_* format
 * @param {string} role
 * @returns {string} e.g. "ROLE_ADMIN" or "ROLE_EMPLOYEE"
 */
export const normalizeRole = (role) => {
  if (!role || typeof role !== 'string') return '';
  const trimmed = role.trim().toUpperCase();
  return trimmed.startsWith('ROLE_') ? trimmed : `ROLE_${trimmed}`;
};

/**
 * Checks if a user has the ADMIN role
 * @param {string|object} roleOrUser
 * @returns {boolean}
 */
export const isAdmin = (roleOrUser) => {
  const role = typeof roleOrUser === 'object' && roleOrUser !== null
    ? roleOrUser.role
    : roleOrUser;
  return normalizeRole(role) === ROLES.ADMIN;
};

/**
 * Checks if a user has the EMPLOYEE role
 * @param {string|object} roleOrUser
 * @returns {boolean}
 */
export const isEmployee = (roleOrUser) => {
  const role = typeof roleOrUser === 'object' && roleOrUser !== null
    ? roleOrUser.role
    : roleOrUser;
  return normalizeRole(role) === ROLES.EMPLOYEE;
};

/**
 * Returns a human-friendly role name for display (e.g. "Admin", "Employee")
 * @param {string} role
 * @returns {string}
 */
export const formatRoleName = (role) => {
  const normalized = normalizeRole(role);
  if (normalized === ROLES.ADMIN) return 'Administrator';
  if (normalized === ROLES.EMPLOYEE) return 'Employee';
  return role || 'User';
};
